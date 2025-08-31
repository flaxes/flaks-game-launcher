declare interface LinkTargetInfo {
    Name: string;
    FullName: string;
    Target: string;
    Arguments: string;
    WorkingDir: string;
}

declare interface LinkLaunched {
    alias: string;
    pid: number;
}
