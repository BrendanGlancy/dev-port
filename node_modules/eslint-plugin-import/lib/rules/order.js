'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);

var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var defaultGroups = ['builtin', 'external', 'parent', 'sibling', 'index'];

// REPORTING AND FIXING

function reverse(array) {
  return array.map(function (v) {
    return Object.assign({}, v, { rank: -v.rank });
  }).reverse();
}

function getTokensOrCommentsAfter(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentAfter(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result;
}

function getTokensOrCommentsBefore(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentBefore(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result.reverse();
}

function takeTokensAfterWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsAfter(sourceCode, node, 100);
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result;
}

function takeTokensBeforeWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsBefore(sourceCode, node, 100);
  var result = [];
  for (var i = tokens.length - 1; i >= 0; i--) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result.reverse();
}

function findOutOfOrder(imported) {
  if (imported.length === 0) {
    return [];
  }
  var maxSeenRankNode = imported[0];
  return imported.filter(function (importedModule) {
    var res = importedModule.rank < maxSeenRankNode.rank;
    if (maxSeenRankNode.rank < importedModule.rank) {
      maxSeenRankNode = importedModule;
    }
    return res;
  });
}

function findRootNode(node) {
  var parent = node;
  while (parent.parent != null && parent.parent.body == null) {
    parent = parent.parent;
  }
  return parent;
}

function findEndOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensAfterWhile(sourceCode, node, commentOnSameLineAs(node));
  var endOfTokens = tokensToEndOfLine.length > 0 ?
  tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1] :
  node.range[1];
  var result = endOfTokens;
  for (var i = endOfTokens; i < sourceCode.text.length; i++) {
    if (sourceCode.text[i] === '\n') {
      result = i + 1;
      break;
    }
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t' && sourceCode.text[i] !== '\r') {
      break;
    }
    result = i + 1;
  }
  return result;
}

function commentOnSameLineAs(node) {
  return function (token) {return (token.type === 'Block' || token.type === 'Line') &&
    token.loc.start.line === token.loc.end.line &&
    token.loc.end.line === node.loc.end.line;};
}

function findStartOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensBeforeWhile(sourceCode, node, commentOnSameLineAs(node));
  var startOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0];
  var result = startOfTokens;
  for (var i = startOfTokens - 1; i > 0; i--) {
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
      break;
    }
    result = i;
  }
  return result;
}

function isRequireExpression(expr) {
  return expr != null &&
  expr.type === 'CallExpression' &&
  expr.callee != null &&
  expr.callee.name === 'require' &&
  expr.arguments != null &&
  expr.arguments.length === 1 &&
  expr.arguments[0].type === 'Literal';
}

function isSupportedRequireModule(node) {
  if (node.type !== 'VariableDeclaration') {
    return false;
  }
  if (node.declarations.length !== 1) {
    return false;
  }
  var decl = node.declarations[0];
  var isPlainRequire = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  isRequireExpression(decl.init);
  var isRequireWithMemberExpression = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  decl.init != null &&
  decl.init.type === 'CallExpression' &&
  decl.init.callee != null &&
  decl.init.callee.type === 'MemberExpression' &&
  isRequireExpression(decl.init.callee.object);
  return isPlainRequire || isRequireWithMemberExpression;
}

function isPlainImportModule(node) {
  return node.type === 'ImportDeclaration' && node.specifiers != null && node.specifiers.length > 0;
}

function isPlainImportEquals(node) {
  return node.type === 'TSImportEqualsDeclaration' && node.moduleReference.expression;
}

function canCrossNodeWhileReorder(node) {
  return isSupportedRequireModule(node) || isPlainImportModule(node) || isPlainImportEquals(node);
}

function canReorderItems(firstNode, secondNode) {
  var parent = firstNode.parent;var _sort =
  [
  parent.body.indexOf(firstNode),
  parent.body.indexOf(secondNode)].
  sort(),_sort2 = _slicedToArray(_sort, 2),firstIndex = _sort2[0],secondIndex = _sort2[1];
  var nodesBetween = parent.body.slice(firstIndex, secondIndex + 1);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = nodesBetween[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var nodeBetween = _step.value;
      if (!canCrossNodeWhileReorder(nodeBetween)) {
        return false;
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  return true;
}

function makeImportDescription(node) {
  if (node.node.importKind === 'type') {
    return 'type import';
  }
  if (node.node.importKind === 'typeof') {
    return 'typeof import';
  }
  return 'import';
}

function fixOutOfOrder(context, firstNode, secondNode, order) {
  var sourceCode = context.getSourceCode();

  var firstRoot = findRootNode(firstNode.node);
  var firstRootStart = findStartOfLineWithComments(sourceCode, firstRoot);
  var firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot);

  var secondRoot = findRootNode(secondNode.node);
  var secondRootStart = findStartOfLineWithComments(sourceCode, secondRoot);
  var secondRootEnd = findEndOfLineWithComments(sourceCode, secondRoot);
  var canFix = canReorderItems(firstRoot, secondRoot);

  var newCode = sourceCode.text.substring(secondRootStart, secondRootEnd);
  if (newCode[newCode.length - 1] !== '\n') {
    newCode = newCode + '\n';
  }

  var firstImport = String(makeImportDescription(firstNode)) + ' of `' + String(firstNode.displayName) + '`';
  var secondImport = '`' + String(secondNode.displayName) + '` ' + String(makeImportDescription(secondNode));
  var message = secondImport + ' should occur ' + String(order) + ' ' + firstImport;

  if (order === 'before') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return (
          fixer.replaceTextRange(
          [firstRootStart, secondRootEnd],
          newCode + sourceCode.text.substring(firstRootStart, secondRootStart)));} });


  } else if (order === 'after') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return (
          fixer.replaceTextRange(
          [secondRootStart, firstRootEnd],
          sourceCode.text.substring(secondRootEnd, firstRootEnd) + newCode));} });


  }
}

function reportOutOfOrder(context, imported, outOfOrder, order) {
  outOfOrder.forEach(function (imp) {
    var found = imported.find(function () {function hasHigherRank(importedItem) {
        return importedItem.rank > imp.rank;
      }return hasHigherRank;}());
    fixOutOfOrder(context, found, imp, order);
  });
}

function makeOutOfOrderReport(context, imported) {
  var outOfOrder = findOutOfOrder(imported);
  if (!outOfOrder.length) {
    return;
  }
  // There are things to report. Try to minimize the number of reported errors.
  var reversedImported = reverse(imported);
  var reversedOrder = findOutOfOrder(reversedImported);
  if (reversedOrder.length < outOfOrder.length) {
    reportOutOfOrder(context, reversedImported, reversedOrder, 'after');
    return;
  }
  reportOutOfOrder(context, imported, outOfOrder, 'before');
}

var compareString = function compareString(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/** Some parsers (languages without types) don't provide ImportKind */
var DEAFULT_IMPORT_KIND = 'value';
var getNormalizedValue = function getNormalizedValue(node, toLowerCase) {
  var value = node.value;
  return toLowerCase ? String(value).toLowerCase() : value;
};

function getSorter(alphabetizeOptions) {
  var multiplier = alphabetizeOptions.order === 'asc' ? 1 : -1;
  var orderImportKind = alphabetizeOptions.orderImportKind;
  var multiplierImportKind = orderImportKind !== 'ignore' && (
  alphabetizeOptions.orderImportKind === 'asc' ? 1 : -1);

  return function () {function importsSorter(nodeA, nodeB) {
      var importA = getNormalizedValue(nodeA, alphabetizeOptions.caseInsensitive);
      var importB = getNormalizedValue(nodeB, alphabetizeOptions.caseInsensitive);
      var result = 0;

      if (!(0, _arrayIncludes2['default'])(importA, '/') && !(0, _arrayIncludes2['default'])(importB, '/')) {
        result = compareString(importA, importB);
      } else {
        var A = importA.split('/');
        var B = importB.split('/');
        var a = A.length;
        var b = B.length;

        for (var i = 0; i < Math.min(a, b); i++) {
          result = compareString(A[i], B[i]);
          if (result) break;
        }

        if (!result && a !== b) {
          result = a < b ? -1 : 1;
        }
      }

      result = result * multiplier;

      // In case the paths are equal (result === 0), sort them by importKind
      if (!result && multiplierImportKind) {
        result = multiplierImportKind * compareString(
        nodeA.node.importKind || DEAFULT_IMPORT_KIND,
        nodeB.node.importKind || DEAFULT_IMPORT_KIND);

      }

      return result;
    }return importsSorter;}();
}

function mutateRanksToAlphabetize(imported, alphabetizeOptions) {
  var groupedByRanks = imported.reduce(function (acc, importedItem) {
    if (!Array.isArray(acc[importedItem.rank])) {
      acc[importedItem.rank] = [];
    }
    acc[importedItem.rank].push(importedItem);
    return acc;
  }, {});

  var groupRanks = Object.keys(groupedByRanks);

  var sorterFn = getSorter(alphabetizeOptions);

  // sort imports locally within their group
  groupRanks.forEach(function (groupRank) {
    groupedByRanks[groupRank].sort(sorterFn);
  });

  // assign globally unique rank to each import
  var newRank = 0;
  var alphabetizedRanks = groupRanks.sort().reduce(function (acc, groupRank) {
    groupedByRanks[groupRank].forEach(function (importedItem) {
      acc[String(importedItem.value) + '|' + String(importedItem.node.importKind)] = parseInt(groupRank, 10) + newRank;
      newRank += 1;
    });
    return acc;
  }, {});

  // mutate the original group-rank with alphabetized-rank
  imported.forEach(function (importedItem) {
    importedItem.rank = alphabetizedRanks[String(importedItem.value) + '|' + String(importedItem.node.importKind)];
  });
}

// DETECTING

function computePathRank(ranks, pathGroups, path, maxPosition) {
  for (var i = 0, l = pathGroups.length; i < l; i++) {var _pathGroups$i =
    pathGroups[i],pattern = _pathGroups$i.pattern,patternOptions = _pathGroups$i.patternOptions,group = _pathGroups$i.group,_pathGroups$i$positio = _pathGroups$i.position,position = _pathGroups$i$positio === undefined ? 1 : _pathGroups$i$positio;
    if ((0, _minimatch2['default'])(path, pattern, patternOptions || { nocomment: true })) {
      return ranks[group] + position / maxPosition;
    }
  }
}

function computeRank(context, ranks, importEntry, excludedImportTypes) {
  var impType = void 0;
  var rank = void 0;
  if (importEntry.type === 'import:object') {
    impType = 'object';
  } else if (importEntry.node.importKind === 'type' && ranks.omittedTypes.indexOf('type') === -1) {
    impType = 'type';
  } else {
    impType = (0, _importType2['default'])(importEntry.value, context);
  }
  if (!excludedImportTypes.has(impType)) {
    rank = computePathRank(ranks.groups, ranks.pathGroups, importEntry.value, ranks.maxPosition);
  }
  if (typeof rank === 'undefined') {
    rank = ranks.groups[impType];
  }
  if (importEntry.type !== 'import' && !importEntry.type.startsWith('import:')) {
    rank += 100;
  }

  return rank;
}

function registerNode(context, importEntry, ranks, imported, excludedImportTypes) {
  var rank = computeRank(context, ranks, importEntry, excludedImportTypes);
  if (rank !== -1) {
    imported.push(Object.assign({}, importEntry, { rank: rank }));
  }
}

function getRequireBlock(node) {
  var n = node;
  // Handle cases like `const baz = require('foo').bar.baz`
  // and `const foo = require('foo')()`
  while (
  n.parent.type === 'MemberExpression' && n.parent.object === n ||
  n.parent.type === 'CallExpression' && n.parent.callee === n)
  {
    n = n.parent;
  }
  if (
  n.parent.type === 'VariableDeclarator' &&
  n.parent.parent.type === 'VariableDeclaration' &&
  n.parent.parent.parent.type === 'Program')
  {
    return n.parent.parent.parent;
  }
}

var types = ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'];

// Creates an object with type-rank pairs.
// Example: { index: 0, sibling: 1, parent: 1, external: 1, builtin: 2, internal: 2 }
// Will throw an error if it contains a type that does not exist, or has a duplicate
function convertGroupsToRanks(groups) {
  var rankObject = groups.reduce(function (res, group, index) {
    if (typeof group === 'string') {
      group = [group];
    }
    group.forEach(function (groupItem) {
      if (types.indexOf(groupItem) === -1) {
        throw new Error('Incorrect configuration of the rule: Unknown type `' +
        JSON.stringify(groupItem) + '`');
      }
      if (res[groupItem] !== undefined) {
        throw new Error('Incorrect configuration of the rule: `' + groupItem + '` is duplicated');
      }
      res[groupItem] = index * 2;
    });
    return res;
  }, {});

  var omittedTypes = types.filter(function (type) {
    return rankObject[type] === undefined;
  });

  var ranks = omittedTypes.reduce(function (res, type) {
    res[type] = groups.length * 2;
    return res;
  }, rankObject);

  return { groups: ranks, omittedTypes: omittedTypes };
}

function convertPathGroupsForRanks(pathGroups) {
  var after = {};
  var before = {};

  var transformed = pathGroups.map(function (pathGroup, index) {var
    group = pathGroup.group,positionString = pathGroup.position;
    var position = 0;
    if (positionString === 'after') {
      if (!after[group]) {
        after[group] = 1;
      }
      position = after[group]++;
    } else if (positionString === 'before') {
      if (!before[group]) {
        before[group] = [];
      }
      before[group].push(index);
    }

    return Object.assign({}, pathGroup, { position: position });
  });

  var maxPosition = 1;

  Object.keys(before).forEach(function (group) {
    var groupLength = before[group].length;
    before[group].forEach(function (groupIndex, index) {
      transformed[groupIndex].position = -1 * (groupLength - index);
    });
    maxPosition = Math.max(maxPosition, groupLength);
  });

  Object.keys(after).forEach(function (key) {
    var groupNextPosition = after[key];
    maxPosition = Math.max(maxPosition, groupNextPosition - 1);
  });

  return {
    pathGroups: transformed,
    maxPosition: maxPosition > 10 ? Math.pow(10, Math.ceil(Math.log10(maxPosition))) : 10 };

}

function fixNewLineAfterImport(context, previousImport) {
  var prevRoot = findRootNode(previousImport.node);
  var tokensToEndOfLine = takeTokensAfterWhile(
  context.getSourceCode(), prevRoot, commentOnSameLineAs(prevRoot));

  var endOfLine = prevRoot.range[1];
  if (tokensToEndOfLine.length > 0) {
    endOfLine = tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1];
  }
  return function (fixer) {return fixer.insertTextAfterRange([prevRoot.range[0], endOfLine], '\n');};
}

function removeNewLineAfterImport(context, currentImport, previousImport) {
  var sourceCode = context.getSourceCode();
  var prevRoot = findRootNode(previousImport.node);
  var currRoot = findRootNode(currentImport.node);
  var rangeToRemove = [
  findEndOfLineWithComments(sourceCode, prevRoot),
  findStartOfLineWithComments(sourceCode, currRoot)];

  if (/^\s*$/.test(sourceCode.text.substring(rangeToRemove[0], rangeToRemove[1]))) {
    return function (fixer) {return fixer.removeRange(rangeToRemove);};
  }
  return undefined;
}

function makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup) {
  var getNumberOfEmptyLinesBetween = function getNumberOfEmptyLinesBetween(currentImport, previousImport) {
    var linesBetweenImports = context.getSourceCode().lines.slice(
    previousImport.node.loc.end.line,
    currentImport.node.loc.start.line - 1);


    return linesBetweenImports.filter(function (line) {return !line.trim().length;}).length;
  };
  var getIsStartOfDistinctGroup = function getIsStartOfDistinctGroup(currentImport, previousImport) {
    return currentImport.rank - 1 >= previousImport.rank;
  };
  var previousImport = imported[0];

  imported.slice(1).forEach(function (currentImport) {
    var emptyLinesBetween = getNumberOfEmptyLinesBetween(currentImport, previousImport);
    var isStartOfDistinctGroup = getIsStartOfDistinctGroup(currentImport, previousImport);

    if (newlinesBetweenImports === 'always' ||
    newlinesBetweenImports === 'always-and-inside-groups') {
      if (currentImport.rank !== previousImport.rank && emptyLinesBetween === 0) {
        if (distinctGroup || !distinctGroup && isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be at least one empty line between import groups',
            fix: fixNewLineAfterImport(context, previousImport) });

        }
      } else if (emptyLinesBetween > 0 &&
      newlinesBetweenImports !== 'always-and-inside-groups') {
        if (distinctGroup && currentImport.rank === previousImport.rank || !distinctGroup && !isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be no empty line within import group',
            fix: removeNewLineAfterImport(context, currentImport, previousImport) });

        }
      }
    } else if (emptyLinesBetween > 0) {
      context.report({
        node: previousImport.node,
        message: 'There should be no empty line between import groups',
        fix: removeNewLineAfterImport(context, currentImport, previousImport) });

    }

    previousImport = currentImport;
  });
}

function getAlphabetizeConfig(options) {
  var alphabetize = options.alphabetize || {};
  var order = alphabetize.order || 'ignore';
  var orderImportKind = alphabetize.orderImportKind || 'ignore';
  var caseInsensitive = alphabetize.caseInsensitive || false;

  return { order: order, orderImportKind: orderImportKind, caseInsensitive: caseInsensitive };
}

// TODO, semver-major: Change the default of "distinctGroup" from true to false
var defaultDistinctGroup = true;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce a convention in module import order.',
      url: (0, _docsUrl2['default'])('order') },


    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        groups: {
          type: 'array' },

        pathGroupsExcludedImportTypes: {
          type: 'array' },

        distinctGroup: {
          type: 'boolean',
          'default': defaultDistinctGroup },

        pathGroups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pattern: {
                type: 'string' },

              patternOptions: {
                type: 'object' },

              group: {
                type: 'string',
                'enum': types },

              position: {
                type: 'string',
                'enum': ['after', 'before'] } },


            additionalProperties: false,
            required: ['pattern', 'group'] } },


        'newlines-between': {
          'enum': [
          'ignore',
          'always',
          'always-and-inside-groups',
          'never'] },


        alphabetize: {
          type: 'object',
          properties: {
            caseInsensitive: {
              type: 'boolean',
              'default': false },

            order: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' },

            orderImportKind: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' } },


          additionalProperties: false },

        warnOnUnassignedImports: {
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function importOrderRule(context) {
      var options = context.options[0] || {};
      var newlinesBetweenImports = options['newlines-between'] || 'ignore';
      var pathGroupsExcludedImportTypes = new Set(options['pathGroupsExcludedImportTypes'] || ['builtin', 'external', 'object']);
      var alphabetize = getAlphabetizeConfig(options);
      var distinctGroup = options.distinctGroup == null ? defaultDistinctGroup : !!options.distinctGroup;
      var ranks = void 0;

      try {var _convertPathGroupsFor =
        convertPathGroupsForRanks(options.pathGroups || []),pathGroups = _convertPathGroupsFor.pathGroups,maxPosition = _convertPathGroupsFor.maxPosition;var _convertGroupsToRanks =
        convertGroupsToRanks(options.groups || defaultGroups),groups = _convertGroupsToRanks.groups,omittedTypes = _convertGroupsToRanks.omittedTypes;
        ranks = {
          groups: groups,
          omittedTypes: omittedTypes,
          pathGroups: pathGroups,
          maxPosition: maxPosition };

      } catch (error) {
        // Malformed configuration
        return {
          Program: function () {function Program(node) {
              context.report(node, error.message);
            }return Program;}() };

      }
      var importMap = new Map();

      function getBlockImports(node) {
        if (!importMap.has(node)) {
          importMap.set(node, []);
        }
        return importMap.get(node);
      }

      return {
        ImportDeclaration: function () {function handleImports(node) {
            // Ignoring unassigned imports unless warnOnUnassignedImports is set
            if (node.specifiers.length || options.warnOnUnassignedImports) {
              var name = node.source.value;
              registerNode(
              context,
              {
                node: node,
                value: name,
                displayName: name,
                type: 'import' },

              ranks,
              getBlockImports(node.parent),
              pathGroupsExcludedImportTypes);

            }
          }return handleImports;}(),
        TSImportEqualsDeclaration: function () {function handleImports(node) {
            var displayName = void 0;
            var value = void 0;
            var type = void 0;
            // skip "export import"s
            if (node.isExport) {
              return;
            }
            if (node.moduleReference.type === 'TSExternalModuleReference') {
              value = node.moduleReference.expression.value;
              displayName = value;
              type = 'import';
            } else {
              value = '';
              displayName = context.getSourceCode().getText(node.moduleReference);
              type = 'import:object';
            }
            registerNode(
            context,
            {
              node: node,
              value: value,
              displayName: displayName,
              type: type },

            ranks,
            getBlockImports(node.parent),
            pathGroupsExcludedImportTypes);

          }return handleImports;}(),
        CallExpression: function () {function handleRequires(node) {
            if (!(0, _staticRequire2['default'])(node)) {
              return;
            }
            var block = getRequireBlock(node);
            if (!block) {
              return;
            }
            var name = node.arguments[0].value;
            registerNode(
            context,
            {
              node: node,
              value: name,
              displayName: name,
              type: 'require' },

            ranks,
            getBlockImports(block),
            pathGroupsExcludedImportTypes);

          }return handleRequires;}(),
        'Program:exit': function () {function reportAndReset() {
            importMap.forEach(function (imported) {
              if (newlinesBetweenImports !== 'ignore') {
                makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup);
              }

              if (alphabetize.order !== 'ignore') {
                mutateRanksToAlphabetize(imported, alphabetize);
              }

              makeOutOfOrderReport(context, imported);
            });

            importMap.clear();
          }return reportAndReset;}() };

    }return importOrderRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9vcmRlci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0R3JvdXBzIiwicmV2ZXJzZSIsImFycmF5IiwibWFwIiwidiIsIk9iamVjdCIsImFzc2lnbiIsInJhbmsiLCJnZXRUb2tlbnNPckNvbW1lbnRzQWZ0ZXIiLCJzb3VyY2VDb2RlIiwibm9kZSIsImNvdW50IiwiY3VycmVudE5vZGVPclRva2VuIiwicmVzdWx0IiwiaSIsImdldFRva2VuT3JDb21tZW50QWZ0ZXIiLCJwdXNoIiwiZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZSIsImdldFRva2VuT3JDb21tZW50QmVmb3JlIiwidGFrZVRva2Vuc0FmdGVyV2hpbGUiLCJjb25kaXRpb24iLCJ0b2tlbnMiLCJsZW5ndGgiLCJ0YWtlVG9rZW5zQmVmb3JlV2hpbGUiLCJmaW5kT3V0T2ZPcmRlciIsImltcG9ydGVkIiwibWF4U2VlblJhbmtOb2RlIiwiZmlsdGVyIiwiaW1wb3J0ZWRNb2R1bGUiLCJyZXMiLCJmaW5kUm9vdE5vZGUiLCJwYXJlbnQiLCJib2R5IiwiZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyIsInRva2Vuc1RvRW5kT2ZMaW5lIiwiY29tbWVudE9uU2FtZUxpbmVBcyIsImVuZE9mVG9rZW5zIiwicmFuZ2UiLCJ0ZXh0IiwidG9rZW4iLCJ0eXBlIiwibG9jIiwic3RhcnQiLCJsaW5lIiwiZW5kIiwiZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzIiwic3RhcnRPZlRva2VucyIsImlzUmVxdWlyZUV4cHJlc3Npb24iLCJleHByIiwiY2FsbGVlIiwibmFtZSIsImFyZ3VtZW50cyIsImlzU3VwcG9ydGVkUmVxdWlyZU1vZHVsZSIsImRlY2xhcmF0aW9ucyIsImRlY2wiLCJpc1BsYWluUmVxdWlyZSIsImlkIiwiaW5pdCIsImlzUmVxdWlyZVdpdGhNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0IiwiaXNQbGFpbkltcG9ydE1vZHVsZSIsInNwZWNpZmllcnMiLCJpc1BsYWluSW1wb3J0RXF1YWxzIiwibW9kdWxlUmVmZXJlbmNlIiwiZXhwcmVzc2lvbiIsImNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlciIsImNhblJlb3JkZXJJdGVtcyIsImZpcnN0Tm9kZSIsInNlY29uZE5vZGUiLCJpbmRleE9mIiwic29ydCIsImZpcnN0SW5kZXgiLCJzZWNvbmRJbmRleCIsIm5vZGVzQmV0d2VlbiIsInNsaWNlIiwibm9kZUJldHdlZW4iLCJtYWtlSW1wb3J0RGVzY3JpcHRpb24iLCJpbXBvcnRLaW5kIiwiZml4T3V0T2ZPcmRlciIsImNvbnRleHQiLCJvcmRlciIsImdldFNvdXJjZUNvZGUiLCJmaXJzdFJvb3QiLCJmaXJzdFJvb3RTdGFydCIsImZpcnN0Um9vdEVuZCIsInNlY29uZFJvb3QiLCJzZWNvbmRSb290U3RhcnQiLCJzZWNvbmRSb290RW5kIiwiY2FuRml4IiwibmV3Q29kZSIsInN1YnN0cmluZyIsImZpcnN0SW1wb3J0IiwiZGlzcGxheU5hbWUiLCJzZWNvbmRJbXBvcnQiLCJtZXNzYWdlIiwicmVwb3J0IiwiZml4IiwiZml4ZXIiLCJyZXBsYWNlVGV4dFJhbmdlIiwicmVwb3J0T3V0T2ZPcmRlciIsIm91dE9mT3JkZXIiLCJmb3JFYWNoIiwiaW1wIiwiZm91bmQiLCJmaW5kIiwiaGFzSGlnaGVyUmFuayIsImltcG9ydGVkSXRlbSIsIm1ha2VPdXRPZk9yZGVyUmVwb3J0IiwicmV2ZXJzZWRJbXBvcnRlZCIsInJldmVyc2VkT3JkZXIiLCJjb21wYXJlU3RyaW5nIiwiYSIsImIiLCJERUFGVUxUX0lNUE9SVF9LSU5EIiwiZ2V0Tm9ybWFsaXplZFZhbHVlIiwidG9Mb3dlckNhc2UiLCJ2YWx1ZSIsIlN0cmluZyIsImdldFNvcnRlciIsImFscGhhYmV0aXplT3B0aW9ucyIsIm11bHRpcGxpZXIiLCJvcmRlckltcG9ydEtpbmQiLCJtdWx0aXBsaWVySW1wb3J0S2luZCIsImltcG9ydHNTb3J0ZXIiLCJub2RlQSIsIm5vZGVCIiwiaW1wb3J0QSIsImNhc2VJbnNlbnNpdGl2ZSIsImltcG9ydEIiLCJBIiwic3BsaXQiLCJCIiwiTWF0aCIsIm1pbiIsIm11dGF0ZVJhbmtzVG9BbHBoYWJldGl6ZSIsImdyb3VwZWRCeVJhbmtzIiwicmVkdWNlIiwiYWNjIiwiQXJyYXkiLCJpc0FycmF5IiwiZ3JvdXBSYW5rcyIsImtleXMiLCJzb3J0ZXJGbiIsImdyb3VwUmFuayIsIm5ld1JhbmsiLCJhbHBoYWJldGl6ZWRSYW5rcyIsInBhcnNlSW50IiwiY29tcHV0ZVBhdGhSYW5rIiwicmFua3MiLCJwYXRoR3JvdXBzIiwicGF0aCIsIm1heFBvc2l0aW9uIiwibCIsInBhdHRlcm4iLCJwYXR0ZXJuT3B0aW9ucyIsImdyb3VwIiwicG9zaXRpb24iLCJub2NvbW1lbnQiLCJjb21wdXRlUmFuayIsImltcG9ydEVudHJ5IiwiZXhjbHVkZWRJbXBvcnRUeXBlcyIsImltcFR5cGUiLCJvbWl0dGVkVHlwZXMiLCJoYXMiLCJncm91cHMiLCJzdGFydHNXaXRoIiwicmVnaXN0ZXJOb2RlIiwiZ2V0UmVxdWlyZUJsb2NrIiwibiIsInR5cGVzIiwiY29udmVydEdyb3Vwc1RvUmFua3MiLCJyYW5rT2JqZWN0IiwiaW5kZXgiLCJncm91cEl0ZW0iLCJFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1bmRlZmluZWQiLCJjb252ZXJ0UGF0aEdyb3Vwc0ZvclJhbmtzIiwiYWZ0ZXIiLCJiZWZvcmUiLCJ0cmFuc2Zvcm1lZCIsInBhdGhHcm91cCIsInBvc2l0aW9uU3RyaW5nIiwiZ3JvdXBMZW5ndGgiLCJncm91cEluZGV4IiwibWF4Iiwia2V5IiwiZ3JvdXBOZXh0UG9zaXRpb24iLCJwb3ciLCJjZWlsIiwibG9nMTAiLCJmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJwcmV2aW91c0ltcG9ydCIsInByZXZSb290IiwiZW5kT2ZMaW5lIiwiaW5zZXJ0VGV4dEFmdGVyUmFuZ2UiLCJyZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJjdXJyZW50SW1wb3J0IiwiY3VyclJvb3QiLCJyYW5nZVRvUmVtb3ZlIiwidGVzdCIsInJlbW92ZVJhbmdlIiwibWFrZU5ld2xpbmVzQmV0d2VlblJlcG9ydCIsIm5ld2xpbmVzQmV0d2VlbkltcG9ydHMiLCJkaXN0aW5jdEdyb3VwIiwiZ2V0TnVtYmVyT2ZFbXB0eUxpbmVzQmV0d2VlbiIsImxpbmVzQmV0d2VlbkltcG9ydHMiLCJsaW5lcyIsInRyaW0iLCJnZXRJc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwIiwiZW1wdHlMaW5lc0JldHdlZW4iLCJpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwIiwiZ2V0QWxwaGFiZXRpemVDb25maWciLCJvcHRpb25zIiwiYWxwaGFiZXRpemUiLCJkZWZhdWx0RGlzdGluY3RHcm91cCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsInBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzIiwiaXRlbXMiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsInJlcXVpcmVkIiwid2Fybk9uVW5hc3NpZ25lZEltcG9ydHMiLCJjcmVhdGUiLCJpbXBvcnRPcmRlclJ1bGUiLCJTZXQiLCJlcnJvciIsIlByb2dyYW0iLCJpbXBvcnRNYXAiLCJNYXAiLCJnZXRCbG9ja0ltcG9ydHMiLCJzZXQiLCJnZXQiLCJJbXBvcnREZWNsYXJhdGlvbiIsImhhbmRsZUltcG9ydHMiLCJzb3VyY2UiLCJUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uIiwiaXNFeHBvcnQiLCJnZXRUZXh0IiwiQ2FsbEV4cHJlc3Npb24iLCJoYW5kbGVSZXF1aXJlcyIsImJsb2NrIiwicmVwb3J0QW5kUmVzZXQiLCJjbGVhciJdLCJtYXBwaW5ncyI6IkFBQUEsYTs7QUFFQSxzQztBQUNBLCtDOztBQUVBLGdEO0FBQ0Esc0Q7QUFDQSxxQzs7QUFFQSxJQUFNQSxnQkFBZ0IsQ0FBQyxTQUFELEVBQVksVUFBWixFQUF3QixRQUF4QixFQUFrQyxTQUFsQyxFQUE2QyxPQUE3QyxDQUF0Qjs7QUFFQTs7QUFFQSxTQUFT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QUFFRCxrQkFBSVUsWUFBWXZJLEtBQVosS0FBc0IsUUFBMUIsRUFBb0M7QUFDbENzRCx5Q0FBeUI3RyxRQUF6QixFQUFtQzhMLFdBQW5DO0FBQ0Q7O0FBRUQ1RyxtQ0FBcUI1QixPQUFyQixFQUE4QnRELFFBQTlCO0FBQ0QsYUFWRDs7QUFZQW9OLHNCQUFVZSxLQUFWO0FBQ0QsV0FkRCxPQUF5QkQsY0FBekIsSUF2RUssRUFBUDs7QUF1RkQsS0F6SEQsT0FBaUJsQixlQUFqQixJQXBGZSxFQUFqQiIsImZpbGUiOiJvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnO1xuaW1wb3J0IGluY2x1ZGVzIGZyb20gJ2FycmF5LWluY2x1ZGVzJztcblxuaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJztcbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5jb25zdCBkZWZhdWx0R3JvdXBzID0gWydidWlsdGluJywgJ2V4dGVybmFsJywgJ3BhcmVudCcsICdzaWJsaW5nJywgJ2luZGV4J107XG5cbi8vIFJFUE9SVElORyBBTkQgRklYSU5HXG5cbmZ1bmN0aW9uIHJldmVyc2UoYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5Lm1hcChmdW5jdGlvbiAodikge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB2LCB7IHJhbms6IC12LnJhbmsgfSk7XG4gIH0pLnJldmVyc2UoKTtcbn1cblxuZnVuY3Rpb24gZ2V0VG9rZW5zT3JDb21tZW50c0FmdGVyKHNvdXJjZUNvZGUsIG5vZGUsIGNvdW50KSB7XG4gIGxldCBjdXJyZW50Tm9kZU9yVG9rZW4gPSBub2RlO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgY3VycmVudE5vZGVPclRva2VuID0gc291cmNlQ29kZS5nZXRUb2tlbk9yQ29tbWVudEFmdGVyKGN1cnJlbnROb2RlT3JUb2tlbik7XG4gICAgaWYgKGN1cnJlbnROb2RlT3JUb2tlbiA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goY3VycmVudE5vZGVPclRva2VuKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZXRUb2tlbnNPckNvbW1lbnRzQmVmb3JlKHNvdXJjZUNvZGUsIG5vZGUsIGNvdW50KSB7XG4gIGxldCBjdXJyZW50Tm9kZU9yVG9rZW4gPSBub2RlO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgY3VycmVudE5vZGVPclRva2VuID0gc291cmNlQ29kZS5nZXRUb2tlbk9yQ29tbWVudEJlZm9yZShjdXJyZW50Tm9kZU9yVG9rZW4pO1xuICAgIGlmIChjdXJyZW50Tm9kZU9yVG9rZW4gPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGN1cnJlbnROb2RlT3JUb2tlbik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5yZXZlcnNlKCk7XG59XG5cbmZ1bmN0aW9uIHRha2VUb2tlbnNBZnRlcldoaWxlKHNvdXJjZUNvZGUsIG5vZGUsIGNvbmRpdGlvbikge1xuICBjb25zdCB0b2tlbnMgPSBnZXRUb2tlbnNPckNvbW1lbnRzQWZ0ZXIoc291cmNlQ29kZSwgbm9kZSwgMTAwKTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGNvbmRpdGlvbih0b2tlbnNbaV0pKSB7XG4gICAgICByZXN1bHQucHVzaCh0b2tlbnNbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdGFrZVRva2Vuc0JlZm9yZVdoaWxlKHNvdXJjZUNvZGUsIG5vZGUsIGNvbmRpdGlvbikge1xuICBjb25zdCB0b2tlbnMgPSBnZXRUb2tlbnNPckNvbW1lbnRzQmVmb3JlKHNvdXJjZUNvZGUsIG5vZGUsIDEwMCk7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBmb3IgKGxldCBpID0gdG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGNvbmRpdGlvbih0b2tlbnNbaV0pKSB7XG4gICAgICByZXN1bHQucHVzaCh0b2tlbnNbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5yZXZlcnNlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRPdXRPZk9yZGVyKGltcG9ydGVkKSB7XG4gIGlmIChpbXBvcnRlZC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgbGV0IG1heFNlZW5SYW5rTm9kZSA9IGltcG9ydGVkWzBdO1xuICByZXR1cm4gaW1wb3J0ZWQuZmlsdGVyKGZ1bmN0aW9uIChpbXBvcnRlZE1vZHVsZSkge1xuICAgIGNvbnN0IHJlcyA9IGltcG9ydGVkTW9kdWxlLnJhbmsgPCBtYXhTZWVuUmFua05vZGUucmFuaztcbiAgICBpZiAobWF4U2VlblJhbmtOb2RlLnJhbmsgPCBpbXBvcnRlZE1vZHVsZS5yYW5rKSB7XG4gICAgICBtYXhTZWVuUmFua05vZGUgPSBpbXBvcnRlZE1vZHVsZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRSb290Tm9kZShub2RlKSB7XG4gIGxldCBwYXJlbnQgPSBub2RlO1xuICB3aGlsZSAocGFyZW50LnBhcmVudCAhPSBudWxsICYmIHBhcmVudC5wYXJlbnQuYm9keSA9PSBudWxsKSB7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuICByZXR1cm4gcGFyZW50O1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kT2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIG5vZGUpIHtcbiAgY29uc3QgdG9rZW5zVG9FbmRPZkxpbmUgPSB0YWtlVG9rZW5zQWZ0ZXJXaGlsZShzb3VyY2VDb2RlLCBub2RlLCBjb21tZW50T25TYW1lTGluZUFzKG5vZGUpKTtcbiAgY29uc3QgZW5kT2ZUb2tlbnMgPSB0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggPiAwXG4gICAgPyB0b2tlbnNUb0VuZE9mTGluZVt0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggLSAxXS5yYW5nZVsxXVxuICAgIDogbm9kZS5yYW5nZVsxXTtcbiAgbGV0IHJlc3VsdCA9IGVuZE9mVG9rZW5zO1xuICBmb3IgKGxldCBpID0gZW5kT2ZUb2tlbnM7IGkgPCBzb3VyY2VDb2RlLnRleHQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc291cmNlQ29kZS50ZXh0W2ldID09PSAnXFxuJykge1xuICAgICAgcmVzdWx0ID0gaSArIDE7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJyAnICYmIHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJ1xcdCcgJiYgc291cmNlQ29kZS50ZXh0W2ldICE9PSAnXFxyJykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdCA9IGkgKyAxO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbW1lbnRPblNhbWVMaW5lQXMobm9kZSkge1xuICByZXR1cm4gdG9rZW4gPT4gKHRva2VuLnR5cGUgPT09ICdCbG9jaycgfHwgIHRva2VuLnR5cGUgPT09ICdMaW5lJykgJiZcbiAgICAgIHRva2VuLmxvYy5zdGFydC5saW5lID09PSB0b2tlbi5sb2MuZW5kLmxpbmUgJiZcbiAgICAgIHRva2VuLmxvYy5lbmQubGluZSA9PT0gbm9kZS5sb2MuZW5kLmxpbmU7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBub2RlKSB7XG4gIGNvbnN0IHRva2Vuc1RvRW5kT2ZMaW5lID0gdGFrZVRva2Vuc0JlZm9yZVdoaWxlKHNvdXJjZUNvZGUsIG5vZGUsIGNvbW1lbnRPblNhbWVMaW5lQXMobm9kZSkpO1xuICBjb25zdCBzdGFydE9mVG9rZW5zID0gdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoID4gMCA/IHRva2Vuc1RvRW5kT2ZMaW5lWzBdLnJhbmdlWzBdIDogbm9kZS5yYW5nZVswXTtcbiAgbGV0IHJlc3VsdCA9IHN0YXJ0T2ZUb2tlbnM7XG4gIGZvciAobGV0IGkgPSBzdGFydE9mVG9rZW5zIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGlmIChzb3VyY2VDb2RlLnRleHRbaV0gIT09ICcgJyAmJiBzb3VyY2VDb2RlLnRleHRbaV0gIT09ICdcXHQnKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0ID0gaTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpc1JlcXVpcmVFeHByZXNzaW9uKGV4cHIpIHtcbiAgcmV0dXJuIGV4cHIgIT0gbnVsbCAmJlxuICAgIGV4cHIudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJlxuICAgIGV4cHIuY2FsbGVlICE9IG51bGwgJiZcbiAgICBleHByLmNhbGxlZS5uYW1lID09PSAncmVxdWlyZScgJiZcbiAgICBleHByLmFyZ3VtZW50cyAhPSBudWxsICYmXG4gICAgZXhwci5hcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgZXhwci5hcmd1bWVudHNbMF0udHlwZSA9PT0gJ0xpdGVyYWwnO1xufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZFJlcXVpcmVNb2R1bGUobm9kZSkge1xuICBpZiAobm9kZS50eXBlICE9PSAnVmFyaWFibGVEZWNsYXJhdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG5vZGUuZGVjbGFyYXRpb25zLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBkZWNsID0gbm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gIGNvbnN0IGlzUGxhaW5SZXF1aXJlID0gZGVjbC5pZCAmJlxuICAgIChkZWNsLmlkLnR5cGUgPT09ICdJZGVudGlmaWVyJyB8fCBkZWNsLmlkLnR5cGUgPT09ICdPYmplY3RQYXR0ZXJuJykgJiZcbiAgICBpc1JlcXVpcmVFeHByZXNzaW9uKGRlY2wuaW5pdCk7XG4gIGNvbnN0IGlzUmVxdWlyZVdpdGhNZW1iZXJFeHByZXNzaW9uID0gZGVjbC5pZCAmJlxuICAgIChkZWNsLmlkLnR5cGUgPT09ICdJZGVudGlmaWVyJyB8fCBkZWNsLmlkLnR5cGUgPT09ICdPYmplY3RQYXR0ZXJuJykgJiZcbiAgICBkZWNsLmluaXQgIT0gbnVsbCAmJlxuICAgIGRlY2wuaW5pdC50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nICYmXG4gICAgZGVjbC5pbml0LmNhbGxlZSAhPSBudWxsICYmXG4gICAgZGVjbC5pbml0LmNhbGxlZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicgJiZcbiAgICBpc1JlcXVpcmVFeHByZXNzaW9uKGRlY2wuaW5pdC5jYWxsZWUub2JqZWN0KTtcbiAgcmV0dXJuIGlzUGxhaW5SZXF1aXJlIHx8IGlzUmVxdWlyZVdpdGhNZW1iZXJFeHByZXNzaW9uO1xufVxuXG5mdW5jdGlvbiBpc1BsYWluSW1wb3J0TW9kdWxlKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJyAmJiBub2RlLnNwZWNpZmllcnMgIT0gbnVsbCAmJiBub2RlLnNwZWNpZmllcnMubGVuZ3RoID4gMDtcbn1cblxuZnVuY3Rpb24gaXNQbGFpbkltcG9ydEVxdWFscyhub2RlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uJyAmJiBub2RlLm1vZHVsZVJlZmVyZW5jZS5leHByZXNzaW9uO1xufVxuXG5mdW5jdGlvbiBjYW5Dcm9zc05vZGVXaGlsZVJlb3JkZXIobm9kZSkge1xuICByZXR1cm4gaXNTdXBwb3J0ZWRSZXF1aXJlTW9kdWxlKG5vZGUpIHx8IGlzUGxhaW5JbXBvcnRNb2R1bGUobm9kZSkgfHwgaXNQbGFpbkltcG9ydEVxdWFscyhub2RlKTtcbn1cblxuZnVuY3Rpb24gY2FuUmVvcmRlckl0ZW1zKGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSkge1xuICBjb25zdCBwYXJlbnQgPSBmaXJzdE5vZGUucGFyZW50O1xuICBjb25zdCBbZmlyc3RJbmRleCwgc2Vjb25kSW5kZXhdID0gW1xuICAgIHBhcmVudC5ib2R5LmluZGV4T2YoZmlyc3ROb2RlKSxcbiAgICBwYXJlbnQuYm9keS5pbmRleE9mKHNlY29uZE5vZGUpLFxuICBdLnNvcnQoKTtcbiAgY29uc3Qgbm9kZXNCZXR3ZWVuID0gcGFyZW50LmJvZHkuc2xpY2UoZmlyc3RJbmRleCwgc2Vjb25kSW5kZXggKyAxKTtcbiAgZm9yIChjb25zdCBub2RlQmV0d2VlbiBvZiBub2Rlc0JldHdlZW4pIHtcbiAgICBpZiAoIWNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlcihub2RlQmV0d2VlbikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIG1ha2VJbXBvcnREZXNjcmlwdGlvbihub2RlKSB7XG4gIGlmIChub2RlLm5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgcmV0dXJuICd0eXBlIGltcG9ydCc7XG4gIH1cbiAgaWYgKG5vZGUubm9kZS5pbXBvcnRLaW5kID09PSAndHlwZW9mJykge1xuICAgIHJldHVybiAndHlwZW9mIGltcG9ydCc7XG4gIH1cbiAgcmV0dXJuICdpbXBvcnQnO1xufVxuXG5mdW5jdGlvbiBmaXhPdXRPZk9yZGVyKGNvbnRleHQsIGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSwgb3JkZXIpIHtcbiAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuXG4gIGNvbnN0IGZpcnN0Um9vdCA9IGZpbmRSb290Tm9kZShmaXJzdE5vZGUubm9kZSk7XG4gIGNvbnN0IGZpcnN0Um9vdFN0YXJ0ID0gZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIGZpcnN0Um9vdCk7XG4gIGNvbnN0IGZpcnN0Um9vdEVuZCA9IGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgZmlyc3RSb290KTtcblxuICBjb25zdCBzZWNvbmRSb290ID0gZmluZFJvb3ROb2RlKHNlY29uZE5vZGUubm9kZSk7XG4gIGNvbnN0IHNlY29uZFJvb3RTdGFydCA9IGZpbmRTdGFydE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBzZWNvbmRSb290KTtcbiAgY29uc3Qgc2Vjb25kUm9vdEVuZCA9IGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgc2Vjb25kUm9vdCk7XG4gIGNvbnN0IGNhbkZpeCA9IGNhblJlb3JkZXJJdGVtcyhmaXJzdFJvb3QsIHNlY29uZFJvb3QpO1xuXG4gIGxldCBuZXdDb2RlID0gc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhzZWNvbmRSb290U3RhcnQsIHNlY29uZFJvb3RFbmQpO1xuICBpZiAobmV3Q29kZVtuZXdDb2RlLmxlbmd0aCAtIDFdICE9PSAnXFxuJykge1xuICAgIG5ld0NvZGUgPSBuZXdDb2RlICsgJ1xcbic7XG4gIH1cblxuICBjb25zdCBmaXJzdEltcG9ydCA9IGAke21ha2VJbXBvcnREZXNjcmlwdGlvbihmaXJzdE5vZGUpfSBvZiBcXGAke2ZpcnN0Tm9kZS5kaXNwbGF5TmFtZX1cXGBgO1xuICBjb25zdCBzZWNvbmRJbXBvcnQgPSBgXFxgJHtzZWNvbmROb2RlLmRpc3BsYXlOYW1lfVxcYCAke21ha2VJbXBvcnREZXNjcmlwdGlvbihzZWNvbmROb2RlKX1gO1xuICBjb25zdCBtZXNzYWdlID0gYCR7c2Vjb25kSW1wb3J0fSBzaG91bGQgb2NjdXIgJHtvcmRlcn0gJHtmaXJzdEltcG9ydH1gO1xuXG4gIGlmIChvcmRlciA9PT0gJ2JlZm9yZScpIHtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBub2RlOiBzZWNvbmROb2RlLm5vZGUsXG4gICAgICBtZXNzYWdlLFxuICAgICAgZml4OiBjYW5GaXggJiYgKGZpeGVyID0+XG4gICAgICAgIGZpeGVyLnJlcGxhY2VUZXh0UmFuZ2UoXG4gICAgICAgICAgW2ZpcnN0Um9vdFN0YXJ0LCBzZWNvbmRSb290RW5kXSxcbiAgICAgICAgICBuZXdDb2RlICsgc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhmaXJzdFJvb3RTdGFydCwgc2Vjb25kUm9vdFN0YXJ0KSxcbiAgICAgICAgKSksXG4gICAgfSk7XG4gIH0gZWxzZSBpZiAob3JkZXIgPT09ICdhZnRlcicpIHtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBub2RlOiBzZWNvbmROb2RlLm5vZGUsXG4gICAgICBtZXNzYWdlLFxuICAgICAgZml4OiBjYW5GaXggJiYgKGZpeGVyID0+XG4gICAgICAgIGZpeGVyLnJlcGxhY2VUZXh0UmFuZ2UoXG4gICAgICAgICAgW3NlY29uZFJvb3RTdGFydCwgZmlyc3RSb290RW5kXSxcbiAgICAgICAgICBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKHNlY29uZFJvb3RFbmQsIGZpcnN0Um9vdEVuZCkgKyBuZXdDb2RlLFxuICAgICAgICApKSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXBvcnRPdXRPZk9yZGVyKGNvbnRleHQsIGltcG9ydGVkLCBvdXRPZk9yZGVyLCBvcmRlcikge1xuICBvdXRPZk9yZGVyLmZvckVhY2goZnVuY3Rpb24gKGltcCkge1xuICAgIGNvbnN0IGZvdW5kID0gaW1wb3J0ZWQuZmluZChmdW5jdGlvbiBoYXNIaWdoZXJSYW5rKGltcG9ydGVkSXRlbSkge1xuICAgICAgcmV0dXJuIGltcG9ydGVkSXRlbS5yYW5rID4gaW1wLnJhbms7XG4gICAgfSk7XG4gICAgZml4T3V0T2ZPcmRlcihjb250ZXh0LCBmb3VuZCwgaW1wLCBvcmRlcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtYWtlT3V0T2ZPcmRlclJlcG9ydChjb250ZXh0LCBpbXBvcnRlZCkge1xuICBjb25zdCBvdXRPZk9yZGVyID0gZmluZE91dE9mT3JkZXIoaW1wb3J0ZWQpO1xuICBpZiAoIW91dE9mT3JkZXIubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIFRoZXJlIGFyZSB0aGluZ3MgdG8gcmVwb3J0LiBUcnkgdG8gbWluaW1pemUgdGhlIG51bWJlciBvZiByZXBvcnRlZCBlcnJvcnMuXG4gIGNvbnN0IHJldmVyc2VkSW1wb3J0ZWQgPSByZXZlcnNlKGltcG9ydGVkKTtcbiAgY29uc3QgcmV2ZXJzZWRPcmRlciA9IGZpbmRPdXRPZk9yZGVyKHJldmVyc2VkSW1wb3J0ZWQpO1xuICBpZiAocmV2ZXJzZWRPcmRlci5sZW5ndGggPCBvdXRPZk9yZGVyLmxlbmd0aCkge1xuICAgIHJlcG9ydE91dE9mT3JkZXIoY29udGV4dCwgcmV2ZXJzZWRJbXBvcnRlZCwgcmV2ZXJzZWRPcmRlciwgJ2FmdGVyJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlcG9ydE91dE9mT3JkZXIoY29udGV4dCwgaW1wb3J0ZWQsIG91dE9mT3JkZXIsICdiZWZvcmUnKTtcbn1cblxuY29uc3QgY29tcGFyZVN0cmluZyA9IChhLCBiKSA9PiB7XG4gIGlmIChhIDwgYikge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbi8qKiBTb21lIHBhcnNlcnMgKGxhbmd1YWdlcyB3aXRob3V0IHR5cGVzKSBkb24ndCBwcm92aWRlIEltcG9ydEtpbmQgKi9cbmNvbnN0IERFQUZVTFRfSU1QT1JUX0tJTkQgPSAndmFsdWUnO1xuY29uc3QgZ2V0Tm9ybWFsaXplZFZhbHVlID0gKG5vZGUsIHRvTG93ZXJDYXNlKSA9PiB7XG4gIGNvbnN0IHZhbHVlID0gbm9kZS52YWx1ZTtcbiAgcmV0dXJuIHRvTG93ZXJDYXNlID8gU3RyaW5nKHZhbHVlKS50b0xvd2VyQ2FzZSgpIDogdmFsdWU7XG59O1xuXG5mdW5jdGlvbiBnZXRTb3J0ZXIoYWxwaGFiZXRpemVPcHRpb25zKSB7XG4gIGNvbnN0IG11bHRpcGxpZXIgPSBhbHBoYWJldGl6ZU9wdGlvbnMub3JkZXIgPT09ICdhc2MnID8gMSA6IC0xO1xuICBjb25zdCBvcmRlckltcG9ydEtpbmQgPSBhbHBoYWJldGl6ZU9wdGlvbnMub3JkZXJJbXBvcnRLaW5kO1xuICBjb25zdCBtdWx0aXBsaWVySW1wb3J0S2luZCA9IG9yZGVySW1wb3J0S2luZCAhPT0gJ2lnbm9yZScgJiZcbiAgICAoYWxwaGFiZXRpemVPcHRpb25zLm9yZGVySW1wb3J0S2luZCA9PT0gJ2FzYycgPyAxIDogLTEpO1xuXG4gIHJldHVybiBmdW5jdGlvbiBpbXBvcnRzU29ydGVyKG5vZGVBLCBub2RlQikge1xuICAgIGNvbnN0IGltcG9ydEEgPSBnZXROb3JtYWxpemVkVmFsdWUobm9kZUEsIGFscGhhYmV0aXplT3B0aW9ucy5jYXNlSW5zZW5zaXRpdmUpO1xuICAgIGNvbnN0IGltcG9ydEIgPSBnZXROb3JtYWxpemVkVmFsdWUobm9kZUIsIGFscGhhYmV0aXplT3B0aW9ucy5jYXNlSW5zZW5zaXRpdmUpO1xuICAgIGxldCByZXN1bHQgPSAwO1xuXG4gICAgaWYgKCFpbmNsdWRlcyhpbXBvcnRBLCAnLycpICYmICFpbmNsdWRlcyhpbXBvcnRCLCAnLycpKSB7XG4gICAgICByZXN1bHQgPSBjb21wYXJlU3RyaW5nKGltcG9ydEEsIGltcG9ydEIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBBID0gaW1wb3J0QS5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgQiA9IGltcG9ydEIuc3BsaXQoJy8nKTtcbiAgICAgIGNvbnN0IGEgPSBBLmxlbmd0aDtcbiAgICAgIGNvbnN0IGIgPSBCLmxlbmd0aDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbihhLCBiKTsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBhcmVTdHJpbmcoQVtpXSwgQltpXSk7XG4gICAgICAgIGlmIChyZXN1bHQpIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3VsdCAmJiBhICE9PSBiKSB7XG4gICAgICAgIHJlc3VsdCA9IGEgPCBiID8gLTEgOiAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdCA9IHJlc3VsdCAqIG11bHRpcGxpZXI7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBwYXRocyBhcmUgZXF1YWwgKHJlc3VsdCA9PT0gMCksIHNvcnQgdGhlbSBieSBpbXBvcnRLaW5kXG4gICAgaWYgKCFyZXN1bHQgJiYgbXVsdGlwbGllckltcG9ydEtpbmQpIHtcbiAgICAgIHJlc3VsdCA9IG11bHRpcGxpZXJJbXBvcnRLaW5kICogY29tcGFyZVN0cmluZyhcbiAgICAgICAgbm9kZUEubm9kZS5pbXBvcnRLaW5kIHx8IERFQUZVTFRfSU1QT1JUX0tJTkQsXG4gICAgICAgIG5vZGVCLm5vZGUuaW1wb3J0S2luZCB8fCBERUFGVUxUX0lNUE9SVF9LSU5ELFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBtdXRhdGVSYW5rc1RvQWxwaGFiZXRpemUoaW1wb3J0ZWQsIGFscGhhYmV0aXplT3B0aW9ucykge1xuICBjb25zdCBncm91cGVkQnlSYW5rcyA9IGltcG9ydGVkLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBpbXBvcnRlZEl0ZW0pIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWNjW2ltcG9ydGVkSXRlbS5yYW5rXSkpIHtcbiAgICAgIGFjY1tpbXBvcnRlZEl0ZW0ucmFua10gPSBbXTtcbiAgICB9XG4gICAgYWNjW2ltcG9ydGVkSXRlbS5yYW5rXS5wdXNoKGltcG9ydGVkSXRlbSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuXG4gIGNvbnN0IGdyb3VwUmFua3MgPSBPYmplY3Qua2V5cyhncm91cGVkQnlSYW5rcyk7XG5cbiAgY29uc3Qgc29ydGVyRm4gPSBnZXRTb3J0ZXIoYWxwaGFiZXRpemVPcHRpb25zKTtcblxuICAvLyBzb3J0IGltcG9ydHMgbG9jYWxseSB3aXRoaW4gdGhlaXIgZ3JvdXBcbiAgZ3JvdXBSYW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChncm91cFJhbmspIHtcbiAgICBncm91cGVkQnlSYW5rc1tncm91cFJhbmtdLnNvcnQoc29ydGVyRm4pO1xuICB9KTtcblxuICAvLyBhc3NpZ24gZ2xvYmFsbHkgdW5pcXVlIHJhbmsgdG8gZWFjaCBpbXBvcnRcbiAgbGV0IG5ld1JhbmsgPSAwO1xuICBjb25zdCBhbHBoYWJldGl6ZWRSYW5rcyA9IGdyb3VwUmFua3Muc29ydCgpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBncm91cFJhbmspIHtcbiAgICBncm91cGVkQnlSYW5rc1tncm91cFJhbmtdLmZvckVhY2goZnVuY3Rpb24gKGltcG9ydGVkSXRlbSkge1xuICAgICAgYWNjW2Ake2ltcG9ydGVkSXRlbS52YWx1ZX18JHtpbXBvcnRlZEl0ZW0ubm9kZS5pbXBvcnRLaW5kfWBdID0gcGFyc2VJbnQoZ3JvdXBSYW5rLCAxMCkgKyBuZXdSYW5rO1xuICAgICAgbmV3UmFuayArPSAxO1xuICAgIH0pO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuICAvLyBtdXRhdGUgdGhlIG9yaWdpbmFsIGdyb3VwLXJhbmsgd2l0aCBhbHBoYWJldGl6ZWQtcmFua1xuICBpbXBvcnRlZC5mb3JFYWNoKGZ1bmN0aW9uIChpbXBvcnRlZEl0ZW0pIHtcbiAgICBpbXBvcnRlZEl0ZW0ucmFuayA9IGFscGhhYmV0aXplZFJhbmtzW2Ake2ltcG9ydGVkSXRlbS52YWx1ZX18JHtpbXBvcnRlZEl0ZW0ubm9kZS5pbXBvcnRLaW5kfWBdO1xuICB9KTtcbn1cblxuLy8gREVURUNUSU5HXG5cbmZ1bmN0aW9uIGNvbXB1dGVQYXRoUmFuayhyYW5rcywgcGF0aEdyb3VwcywgcGF0aCwgbWF4UG9zaXRpb24pIHtcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXRoR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHsgcGF0dGVybiwgcGF0dGVybk9wdGlvbnMsIGdyb3VwLCBwb3NpdGlvbiA9IDEgfSA9IHBhdGhHcm91cHNbaV07XG4gICAgaWYgKG1pbmltYXRjaChwYXRoLCBwYXR0ZXJuLCBwYXR0ZXJuT3B0aW9ucyB8fCB7IG5vY29tbWVudDogdHJ1ZSB9KSkge1xuICAgICAgcmV0dXJuIHJhbmtzW2dyb3VwXSArIChwb3NpdGlvbiAvIG1heFBvc2l0aW9uKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZVJhbmsoY29udGV4dCwgcmFua3MsIGltcG9ydEVudHJ5LCBleGNsdWRlZEltcG9ydFR5cGVzKSB7XG4gIGxldCBpbXBUeXBlO1xuICBsZXQgcmFuaztcbiAgaWYgKGltcG9ydEVudHJ5LnR5cGUgPT09ICdpbXBvcnQ6b2JqZWN0Jykge1xuICAgIGltcFR5cGUgPSAnb2JqZWN0JztcbiAgfSBlbHNlIGlmIChpbXBvcnRFbnRyeS5ub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJyAmJiByYW5rcy5vbWl0dGVkVHlwZXMuaW5kZXhPZigndHlwZScpID09PSAtMSkge1xuICAgIGltcFR5cGUgPSAndHlwZSc7XG4gIH0gZWxzZSB7XG4gICAgaW1wVHlwZSA9IGltcG9ydFR5cGUoaW1wb3J0RW50cnkudmFsdWUsIGNvbnRleHQpO1xuICB9XG4gIGlmICghZXhjbHVkZWRJbXBvcnRUeXBlcy5oYXMoaW1wVHlwZSkpIHtcbiAgICByYW5rID0gY29tcHV0ZVBhdGhSYW5rKHJhbmtzLmdyb3VwcywgcmFua3MucGF0aEdyb3VwcywgaW1wb3J0RW50cnkudmFsdWUsIHJhbmtzLm1heFBvc2l0aW9uKTtcbiAgfVxuICBpZiAodHlwZW9mIHJhbmsgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmFuayA9IHJhbmtzLmdyb3Vwc1tpbXBUeXBlXTtcbiAgfVxuICBpZiAoaW1wb3J0RW50cnkudHlwZSAhPT0gJ2ltcG9ydCcgJiYgIWltcG9ydEVudHJ5LnR5cGUuc3RhcnRzV2l0aCgnaW1wb3J0OicpKSB7XG4gICAgcmFuayArPSAxMDA7XG4gIH1cblxuICByZXR1cm4gcmFuaztcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJOb2RlKGNvbnRleHQsIGltcG9ydEVudHJ5LCByYW5rcywgaW1wb3J0ZWQsIGV4Y2x1ZGVkSW1wb3J0VHlwZXMpIHtcbiAgY29uc3QgcmFuayA9IGNvbXB1dGVSYW5rKGNvbnRleHQsIHJhbmtzLCBpbXBvcnRFbnRyeSwgZXhjbHVkZWRJbXBvcnRUeXBlcyk7XG4gIGlmIChyYW5rICE9PSAtMSkge1xuICAgIGltcG9ydGVkLnB1c2goT2JqZWN0LmFzc2lnbih7fSwgaW1wb3J0RW50cnksIHsgcmFuayB9KSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UmVxdWlyZUJsb2NrKG5vZGUpIHtcbiAgbGV0IG4gPSBub2RlO1xuICAvLyBIYW5kbGUgY2FzZXMgbGlrZSBgY29uc3QgYmF6ID0gcmVxdWlyZSgnZm9vJykuYmFyLmJhemBcbiAgLy8gYW5kIGBjb25zdCBmb28gPSByZXF1aXJlKCdmb28nKSgpYFxuICB3aGlsZSAoXG4gICAgKG4ucGFyZW50LnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJyAmJiBuLnBhcmVudC5vYmplY3QgPT09IG4pIHx8XG4gICAgKG4ucGFyZW50LnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbicgJiYgbi5wYXJlbnQuY2FsbGVlID09PSBuKVxuICApIHtcbiAgICBuID0gbi5wYXJlbnQ7XG4gIH1cbiAgaWYgKFxuICAgIG4ucGFyZW50LnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0b3InICYmXG4gICAgbi5wYXJlbnQucGFyZW50LnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJyAmJlxuICAgIG4ucGFyZW50LnBhcmVudC5wYXJlbnQudHlwZSA9PT0gJ1Byb2dyYW0nXG4gICkge1xuICAgIHJldHVybiBuLnBhcmVudC5wYXJlbnQucGFyZW50O1xuICB9XG59XG5cbmNvbnN0IHR5cGVzID0gWydidWlsdGluJywgJ2V4dGVybmFsJywgJ2ludGVybmFsJywgJ3Vua25vd24nLCAncGFyZW50JywgJ3NpYmxpbmcnLCAnaW5kZXgnLCAnb2JqZWN0JywgJ3R5cGUnXTtcblxuLy8gQ3JlYXRlcyBhbiBvYmplY3Qgd2l0aCB0eXBlLXJhbmsgcGFpcnMuXG4vLyBFeGFtcGxlOiB7IGluZGV4OiAwLCBzaWJsaW5nOiAxLCBwYXJlbnQ6IDEsIGV4dGVybmFsOiAxLCBidWlsdGluOiAyLCBpbnRlcm5hbDogMiB9XG4vLyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGl0IGNvbnRhaW5zIGEgdHlwZSB0aGF0IGRvZXMgbm90IGV4aXN0LCBvciBoYXMgYSBkdXBsaWNhdGVcbmZ1bmN0aW9uIGNvbnZlcnRHcm91cHNUb1JhbmtzKGdyb3Vwcykge1xuICBjb25zdCByYW5rT2JqZWN0ID0gZ3JvdXBzLnJlZHVjZShmdW5jdGlvbiAocmVzLCBncm91cCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIGdyb3VwID09PSAnc3RyaW5nJykge1xuICAgICAgZ3JvdXAgPSBbZ3JvdXBdO1xuICAgIH1cbiAgICBncm91cC5mb3JFYWNoKGZ1bmN0aW9uIChncm91cEl0ZW0pIHtcbiAgICAgIGlmICh0eXBlcy5pbmRleE9mKGdyb3VwSXRlbSkgPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJ1bGU6IFVua25vd24gdHlwZSBgJyArXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZ3JvdXBJdGVtKSArICdgJyk7XG4gICAgICB9XG4gICAgICBpZiAocmVzW2dyb3VwSXRlbV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBjb25maWd1cmF0aW9uIG9mIHRoZSBydWxlOiBgJyArIGdyb3VwSXRlbSArICdgIGlzIGR1cGxpY2F0ZWQnKTtcbiAgICAgIH1cbiAgICAgIHJlc1tncm91cEl0ZW1dID0gaW5kZXggKiAyO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH0sIHt9KTtcblxuICBjb25zdCBvbWl0dGVkVHlwZXMgPSB0eXBlcy5maWx0ZXIoZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gcmFua09iamVjdFt0eXBlXSA9PT0gdW5kZWZpbmVkO1xuICB9KTtcblxuICBjb25zdCByYW5rcyA9IG9taXR0ZWRUeXBlcy5yZWR1Y2UoZnVuY3Rpb24gKHJlcywgdHlwZSkge1xuICAgIHJlc1t0eXBlXSA9IGdyb3Vwcy5sZW5ndGggKiAyO1xuICAgIHJldHVybiByZXM7XG4gIH0sIHJhbmtPYmplY3QpO1xuXG4gIHJldHVybiB7IGdyb3VwczogcmFua3MsIG9taXR0ZWRUeXBlcyB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UGF0aEdyb3Vwc0ZvclJhbmtzKHBhdGhHcm91cHMpIHtcbiAgY29uc3QgYWZ0ZXIgPSB7fTtcbiAgY29uc3QgYmVmb3JlID0ge307XG5cbiAgY29uc3QgdHJhbnNmb3JtZWQgPSBwYXRoR3JvdXBzLm1hcCgocGF0aEdyb3VwLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHsgZ3JvdXAsIHBvc2l0aW9uOiBwb3NpdGlvblN0cmluZyB9ID0gcGF0aEdyb3VwO1xuICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgaWYgKHBvc2l0aW9uU3RyaW5nID09PSAnYWZ0ZXInKSB7XG4gICAgICBpZiAoIWFmdGVyW2dyb3VwXSkge1xuICAgICAgICBhZnRlcltncm91cF0gPSAxO1xuICAgICAgfVxuICAgICAgcG9zaXRpb24gPSBhZnRlcltncm91cF0rKztcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uU3RyaW5nID09PSAnYmVmb3JlJykge1xuICAgICAgaWYgKCFiZWZvcmVbZ3JvdXBdKSB7XG4gICAgICAgIGJlZm9yZVtncm91cF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIGJlZm9yZVtncm91cF0ucHVzaChpbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHBhdGhHcm91cCwgeyBwb3NpdGlvbiB9KTtcbiAgfSk7XG5cbiAgbGV0IG1heFBvc2l0aW9uID0gMTtcblxuICBPYmplY3Qua2V5cyhiZWZvcmUpLmZvckVhY2goKGdyb3VwKSA9PiB7XG4gICAgY29uc3QgZ3JvdXBMZW5ndGggPSBiZWZvcmVbZ3JvdXBdLmxlbmd0aDtcbiAgICBiZWZvcmVbZ3JvdXBdLmZvckVhY2goKGdyb3VwSW5kZXgsIGluZGV4KSA9PiB7XG4gICAgICB0cmFuc2Zvcm1lZFtncm91cEluZGV4XS5wb3NpdGlvbiA9IC0xICogKGdyb3VwTGVuZ3RoIC0gaW5kZXgpO1xuICAgIH0pO1xuICAgIG1heFBvc2l0aW9uID0gTWF0aC5tYXgobWF4UG9zaXRpb24sIGdyb3VwTGVuZ3RoKTtcbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMoYWZ0ZXIpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IGdyb3VwTmV4dFBvc2l0aW9uID0gYWZ0ZXJba2V5XTtcbiAgICBtYXhQb3NpdGlvbiA9IE1hdGgubWF4KG1heFBvc2l0aW9uLCBncm91cE5leHRQb3NpdGlvbiAtIDEpO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHBhdGhHcm91cHM6IHRyYW5zZm9ybWVkLFxuICAgIG1heFBvc2l0aW9uOiBtYXhQb3NpdGlvbiA+IDEwID8gTWF0aC5wb3coMTAsIE1hdGguY2VpbChNYXRoLmxvZzEwKG1heFBvc2l0aW9uKSkpIDogMTAsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGZpeE5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBwcmV2aW91c0ltcG9ydCkge1xuICBjb25zdCBwcmV2Um9vdCA9IGZpbmRSb290Tm9kZShwcmV2aW91c0ltcG9ydC5ub2RlKTtcbiAgY29uc3QgdG9rZW5zVG9FbmRPZkxpbmUgPSB0YWtlVG9rZW5zQWZ0ZXJXaGlsZShcbiAgICBjb250ZXh0LmdldFNvdXJjZUNvZGUoKSwgcHJldlJvb3QsIGNvbW1lbnRPblNhbWVMaW5lQXMocHJldlJvb3QpKTtcblxuICBsZXQgZW5kT2ZMaW5lID0gcHJldlJvb3QucmFuZ2VbMV07XG4gIGlmICh0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggPiAwKSB7XG4gICAgZW5kT2ZMaW5lID0gdG9rZW5zVG9FbmRPZkxpbmVbdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoIC0gMV0ucmFuZ2VbMV07XG4gIH1cbiAgcmV0dXJuIChmaXhlcikgPT4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyUmFuZ2UoW3ByZXZSb290LnJhbmdlWzBdLCBlbmRPZkxpbmVdLCAnXFxuJyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCkge1xuICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG4gIGNvbnN0IHByZXZSb290ID0gZmluZFJvb3ROb2RlKHByZXZpb3VzSW1wb3J0Lm5vZGUpO1xuICBjb25zdCBjdXJyUm9vdCA9IGZpbmRSb290Tm9kZShjdXJyZW50SW1wb3J0Lm5vZGUpO1xuICBjb25zdCByYW5nZVRvUmVtb3ZlID0gW1xuICAgIGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgcHJldlJvb3QpLFxuICAgIGZpbmRTdGFydE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBjdXJyUm9vdCksXG4gIF07XG4gIGlmICgvXlxccyokLy50ZXN0KHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcocmFuZ2VUb1JlbW92ZVswXSwgcmFuZ2VUb1JlbW92ZVsxXSkpKSB7XG4gICAgcmV0dXJuIChmaXhlcikgPT4gZml4ZXIucmVtb3ZlUmFuZ2UocmFuZ2VUb1JlbW92ZSk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbWFrZU5ld2xpbmVzQmV0d2VlblJlcG9ydChjb250ZXh0LCBpbXBvcnRlZCwgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cywgZGlzdGluY3RHcm91cCkge1xuICBjb25zdCBnZXROdW1iZXJPZkVtcHR5TGluZXNCZXR3ZWVuID0gKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KSA9PiB7XG4gICAgY29uc3QgbGluZXNCZXR3ZWVuSW1wb3J0cyA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpLmxpbmVzLnNsaWNlKFxuICAgICAgcHJldmlvdXNJbXBvcnQubm9kZS5sb2MuZW5kLmxpbmUsXG4gICAgICBjdXJyZW50SW1wb3J0Lm5vZGUubG9jLnN0YXJ0LmxpbmUgLSAxLFxuICAgICk7XG5cbiAgICByZXR1cm4gbGluZXNCZXR3ZWVuSW1wb3J0cy5maWx0ZXIoKGxpbmUpID0+ICFsaW5lLnRyaW0oKS5sZW5ndGgpLmxlbmd0aDtcbiAgfTtcbiAgY29uc3QgZ2V0SXNTdGFydE9mRGlzdGluY3RHcm91cCA9IChjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCkgPT4ge1xuICAgIHJldHVybiBjdXJyZW50SW1wb3J0LnJhbmsgLSAxID49IHByZXZpb3VzSW1wb3J0LnJhbms7XG4gIH07XG4gIGxldCBwcmV2aW91c0ltcG9ydCA9IGltcG9ydGVkWzBdO1xuXG4gIGltcG9ydGVkLnNsaWNlKDEpLmZvckVhY2goZnVuY3Rpb24gKGN1cnJlbnRJbXBvcnQpIHtcbiAgICBjb25zdCBlbXB0eUxpbmVzQmV0d2VlbiA9IGdldE51bWJlck9mRW1wdHlMaW5lc0JldHdlZW4oY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpO1xuICAgIGNvbnN0IGlzU3RhcnRPZkRpc3RpbmN0R3JvdXAgPSBnZXRJc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KTtcblxuICAgIGlmIChuZXdsaW5lc0JldHdlZW5JbXBvcnRzID09PSAnYWx3YXlzJ1xuICAgICAgICB8fCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzID09PSAnYWx3YXlzLWFuZC1pbnNpZGUtZ3JvdXBzJykge1xuICAgICAgaWYgKGN1cnJlbnRJbXBvcnQucmFuayAhPT0gcHJldmlvdXNJbXBvcnQucmFuayAmJiBlbXB0eUxpbmVzQmV0d2VlbiA9PT0gMCkge1xuICAgICAgICBpZiAoZGlzdGluY3RHcm91cCB8fCAoIWRpc3RpbmN0R3JvdXAgJiYgaXNTdGFydE9mRGlzdGluY3RHcm91cCkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlOiBwcmV2aW91c0ltcG9ydC5ub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1RoZXJlIHNob3VsZCBiZSBhdCBsZWFzdCBvbmUgZW1wdHkgbGluZSBiZXR3ZWVuIGltcG9ydCBncm91cHMnLFxuICAgICAgICAgICAgZml4OiBmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgcHJldmlvdXNJbXBvcnQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVtcHR5TGluZXNCZXR3ZWVuID4gMFxuICAgICAgICAmJiBuZXdsaW5lc0JldHdlZW5JbXBvcnRzICE9PSAnYWx3YXlzLWFuZC1pbnNpZGUtZ3JvdXBzJykge1xuICAgICAgICBpZiAoKGRpc3RpbmN0R3JvdXAgJiYgY3VycmVudEltcG9ydC5yYW5rID09PSBwcmV2aW91c0ltcG9ydC5yYW5rKSB8fCAoIWRpc3RpbmN0R3JvdXAgJiYgIWlzU3RhcnRPZkRpc3RpbmN0R3JvdXApKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogcHJldmlvdXNJbXBvcnQubm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGVyZSBzaG91bGQgYmUgbm8gZW1wdHkgbGluZSB3aXRoaW4gaW1wb3J0IGdyb3VwJyxcbiAgICAgICAgICAgIGZpeDogcmVtb3ZlTmV3TGluZUFmdGVySW1wb3J0KGNvbnRleHQsIGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZW1wdHlMaW5lc0JldHdlZW4gPiAwKSB7XG4gICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgIG5vZGU6IHByZXZpb3VzSW1wb3J0Lm5vZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdUaGVyZSBzaG91bGQgYmUgbm8gZW1wdHkgbGluZSBiZXR3ZWVuIGltcG9ydCBncm91cHMnLFxuICAgICAgICBmaXg6IHJlbW92ZU5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwcmV2aW91c0ltcG9ydCA9IGN1cnJlbnRJbXBvcnQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBbHBoYWJldGl6ZUNvbmZpZyhvcHRpb25zKSB7XG4gIGNvbnN0IGFscGhhYmV0aXplID0gb3B0aW9ucy5hbHBoYWJldGl6ZSB8fCB7fTtcbiAgY29uc3Qgb3JkZXIgPSBhbHBoYWJldGl6ZS5vcmRlciB8fCAnaWdub3JlJztcbiAgY29uc3Qgb3JkZXJJbXBvcnRLaW5kID0gYWxwaGFiZXRpemUub3JkZXJJbXBvcnRLaW5kIHx8ICdpZ25vcmUnO1xuICBjb25zdCBjYXNlSW5zZW5zaXRpdmUgPSBhbHBoYWJldGl6ZS5jYXNlSW5zZW5zaXRpdmUgfHwgZmFsc2U7XG5cbiAgcmV0dXJuIHsgb3JkZXIsIG9yZGVySW1wb3J0S2luZCwgY2FzZUluc2Vuc2l0aXZlIH07XG59XG5cbi8vIFRPRE8sIHNlbXZlci1tYWpvcjogQ2hhbmdlIHRoZSBkZWZhdWx0IG9mIFwiZGlzdGluY3RHcm91cFwiIGZyb20gdHJ1ZSB0byBmYWxzZVxuY29uc3QgZGVmYXVsdERpc3RpbmN0R3JvdXAgPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0eWxlIGd1aWRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5mb3JjZSBhIGNvbnZlbnRpb24gaW4gbW9kdWxlIGltcG9ydCBvcmRlci4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCdvcmRlcicpLFxuICAgIH0sXG5cbiAgICBmaXhhYmxlOiAnY29kZScsXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZ3JvdXBzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXN0aW5jdEdyb3VwOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBkZWZhdWx0RGlzdGluY3RHcm91cCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhdGhHcm91cHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHBhdHRlcm46IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGF0dGVybk9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ3JvdXA6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgZW51bTogdHlwZXMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICBlbnVtOiBbJ2FmdGVyJywgJ2JlZm9yZSddLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsncGF0dGVybicsICdncm91cCddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICduZXdsaW5lcy1iZXR3ZWVuJzoge1xuICAgICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgICAnaWdub3JlJyxcbiAgICAgICAgICAgICAgJ2Fsd2F5cycsXG4gICAgICAgICAgICAgICdhbHdheXMtYW5kLWluc2lkZS1ncm91cHMnLFxuICAgICAgICAgICAgICAnbmV2ZXInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFscGhhYmV0aXplOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY2FzZUluc2Vuc2l0aXZlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvcmRlcjoge1xuICAgICAgICAgICAgICAgIGVudW06IFsnaWdub3JlJywgJ2FzYycsICdkZXNjJ10sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2lnbm9yZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG9yZGVySW1wb3J0S2luZDoge1xuICAgICAgICAgICAgICAgIGVudW06IFsnaWdub3JlJywgJ2FzYycsICdkZXNjJ10sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2lnbm9yZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgd2Fybk9uVW5hc3NpZ25lZEltcG9ydHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIGltcG9ydE9yZGVyUnVsZShjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcbiAgICBjb25zdCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzID0gb3B0aW9uc1snbmV3bGluZXMtYmV0d2VlbiddIHx8ICdpZ25vcmUnO1xuICAgIGNvbnN0IHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzID0gbmV3IFNldChvcHRpb25zWydwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyddIHx8IFsnYnVpbHRpbicsICdleHRlcm5hbCcsICdvYmplY3QnXSk7XG4gICAgY29uc3QgYWxwaGFiZXRpemUgPSBnZXRBbHBoYWJldGl6ZUNvbmZpZyhvcHRpb25zKTtcbiAgICBjb25zdCBkaXN0aW5jdEdyb3VwID0gb3B0aW9ucy5kaXN0aW5jdEdyb3VwID09IG51bGwgPyBkZWZhdWx0RGlzdGluY3RHcm91cCA6ICEhb3B0aW9ucy5kaXN0aW5jdEdyb3VwO1xuICAgIGxldCByYW5rcztcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHBhdGhHcm91cHMsIG1heFBvc2l0aW9uIH0gPSBjb252ZXJ0UGF0aEdyb3Vwc0ZvclJhbmtzKG9wdGlvbnMucGF0aEdyb3VwcyB8fCBbXSk7XG4gICAgICBjb25zdCB7IGdyb3Vwcywgb21pdHRlZFR5cGVzIH0gPSBjb252ZXJ0R3JvdXBzVG9SYW5rcyhvcHRpb25zLmdyb3VwcyB8fCBkZWZhdWx0R3JvdXBzKTtcbiAgICAgIHJhbmtzID0ge1xuICAgICAgICBncm91cHMsXG4gICAgICAgIG9taXR0ZWRUeXBlcyxcbiAgICAgICAgcGF0aEdyb3VwcyxcbiAgICAgICAgbWF4UG9zaXRpb24sXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBNYWxmb3JtZWQgY29uZmlndXJhdGlvblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgUHJvZ3JhbShub2RlKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZSwgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBpbXBvcnRNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRCbG9ja0ltcG9ydHMobm9kZSkge1xuICAgICAgaWYgKCFpbXBvcnRNYXAuaGFzKG5vZGUpKSB7XG4gICAgICAgIGltcG9ydE1hcC5zZXQobm9kZSwgW10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGltcG9ydE1hcC5nZXQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uOiBmdW5jdGlvbiBoYW5kbGVJbXBvcnRzKG5vZGUpIHtcbiAgICAgICAgLy8gSWdub3JpbmcgdW5hc3NpZ25lZCBpbXBvcnRzIHVubGVzcyB3YXJuT25VbmFzc2lnbmVkSW1wb3J0cyBpcyBzZXRcbiAgICAgICAgaWYgKG5vZGUuc3BlY2lmaWVycy5sZW5ndGggfHwgb3B0aW9ucy53YXJuT25VbmFzc2lnbmVkSW1wb3J0cykge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSBub2RlLnNvdXJjZS52YWx1ZTtcbiAgICAgICAgICByZWdpc3Rlck5vZGUoXG4gICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICB2YWx1ZTogbmFtZSxcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbXBvcnQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmtzLFxuICAgICAgICAgICAgZ2V0QmxvY2tJbXBvcnRzKG5vZGUucGFyZW50KSxcbiAgICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uOiBmdW5jdGlvbiBoYW5kbGVJbXBvcnRzKG5vZGUpIHtcbiAgICAgICAgbGV0IGRpc3BsYXlOYW1lO1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIGxldCB0eXBlO1xuICAgICAgICAvLyBza2lwIFwiZXhwb3J0IGltcG9ydFwic1xuICAgICAgICBpZiAobm9kZS5pc0V4cG9ydCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5tb2R1bGVSZWZlcmVuY2UudHlwZSA9PT0gJ1RTRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UnKSB7XG4gICAgICAgICAgdmFsdWUgPSBub2RlLm1vZHVsZVJlZmVyZW5jZS5leHByZXNzaW9uLnZhbHVlO1xuICAgICAgICAgIGRpc3BsYXlOYW1lID0gdmFsdWU7XG4gICAgICAgICAgdHlwZSA9ICdpbXBvcnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gJyc7XG4gICAgICAgICAgZGlzcGxheU5hbWUgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKS5nZXRUZXh0KG5vZGUubW9kdWxlUmVmZXJlbmNlKTtcbiAgICAgICAgICB0eXBlID0gJ2ltcG9ydDpvYmplY3QnO1xuICAgICAgICB9XG4gICAgICAgIHJlZ2lzdGVyTm9kZShcbiAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJhbmtzLFxuICAgICAgICAgIGdldEJsb2NrSW1wb3J0cyhub2RlLnBhcmVudCksXG4gICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXMsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgQ2FsbEV4cHJlc3Npb246IGZ1bmN0aW9uIGhhbmRsZVJlcXVpcmVzKG5vZGUpIHtcbiAgICAgICAgaWYgKCFpc1N0YXRpY1JlcXVpcmUobm9kZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSBnZXRSZXF1aXJlQmxvY2sobm9kZSk7XG4gICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmFtZSA9IG5vZGUuYXJndW1lbnRzWzBdLnZhbHVlO1xuICAgICAgICByZWdpc3Rlck5vZGUoXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdmFsdWU6IG5hbWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogbmFtZSxcbiAgICAgICAgICAgIHR5cGU6ICdyZXF1aXJlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJhbmtzLFxuICAgICAgICAgIGdldEJsb2NrSW1wb3J0cyhibG9jayksXG4gICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXMsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgJ1Byb2dyYW06ZXhpdCc6IGZ1bmN0aW9uIHJlcG9ydEFuZFJlc2V0KCkge1xuICAgICAgICBpbXBvcnRNYXAuZm9yRWFjaCgoaW1wb3J0ZWQpID0+IHtcbiAgICAgICAgICBpZiAobmV3bGluZXNCZXR3ZWVuSW1wb3J0cyAhPT0gJ2lnbm9yZScpIHtcbiAgICAgICAgICAgIG1ha2VOZXdsaW5lc0JldHdlZW5SZXBvcnQoY29udGV4dCwgaW1wb3J0ZWQsIG5ld2xpbmVzQmV0d2VlbkltcG9ydHMsIGRpc3RpbmN0R3JvdXApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhbHBoYWJldGl6ZS5vcmRlciAhPT0gJ2lnbm9yZScpIHtcbiAgICAgICAgICAgIG11dGF0ZVJhbmtzVG9BbHBoYWJldGl6ZShpbXBvcnRlZCwgYWxwaGFiZXRpemUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1ha2VPdXRPZk9yZGVyUmVwb3J0KGNvbnRleHQsIGltcG9ydGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW1wb3J0TWFwLmNsZWFyKCk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19