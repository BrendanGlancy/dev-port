export declare function install(useWebpack5: boolean): void;
export declare type CheckReasons = 'test-mode' | 'default' | 'flag-disabled' | 'future-flag';
export declare type CheckResult = {
    enabled: boolean;
    reason: CheckReasons;
};
export declare function shouldLoadWithWebpack5(phase: string, dir: string): Promise<CheckResult>;
