import findRoot from "find-root-kt";
import { existsSync } from "fs";
import { readFile, stat } from "fs/promises";
import path from "path";
type UnwrapPromise<P> = P extends Promise<infer R> ? R : P;
type ReadValueType = UnwrapPromise<ReturnType<typeof readFile>>;
export type ConfigFileReadType = ReadValueType;

let cacheMap: {
    [key: string]: ReadValueType;
} = {};

let pathsCacheMap: {
    [key: string]: string;
} = {};

export const clearConfigCache = () => {
    cacheMap = {};
    pathsCacheMap = {};
};

export const getConfig = async ({
    configFileNameWithExtension,
    cache = true,
    srcDirName = "src",
    encoding = "utf-8",
}: {
    configFileNameWithExtension: string;
    cache?: boolean;
    srcDirName?: string;
    encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "utf-16le" | "ucs2" | "ucs-2" | "base64";
}): Promise<null | ReadValueType> => {
    if (cache && cacheMap[configFileNameWithExtension]) {
        return cacheMap[configFileNameWithExtension];
    }

    const cacheValue = (value: ReadValueType) => {
        if (cache) {
            cacheMap[configFileNameWithExtension] = value;
        }
    };

    const projectRoot = await findRoot();
    let p = path.join(projectRoot, configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        const value = await readFile(p, encoding);
        cacheValue(value);
        return value;
    }

    p = path.join(projectRoot, srcDirName, configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        const value = await readFile(p, encoding);
        cacheValue(value);
        return value;
    }

    p = path.join(projectRoot, "config", configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        const value = await readFile(p, encoding);
        cacheValue(value);
        return value;
    }

    p = path.join(projectRoot, srcDirName, "config", configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        const value = await readFile(p, encoding);
        cacheValue(value);
        return value;
    }

    return null;
};

export const getConfigPath = async ({
    configFileNameWithExtension,
    cache = true,
    srcDirName = "src",
}: {
    configFileNameWithExtension: string;
    cache?: boolean;
    srcDirName?: string;
    encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "utf-16le" | "ucs2" | "ucs-2" | "base64";
}): Promise<null | ReadValueType> => {
    if (cache && pathsCacheMap[configFileNameWithExtension]) {
        return pathsCacheMap[configFileNameWithExtension];
    }

    const cacheValue = (path: string) => {
        if (cache) {
            pathsCacheMap[configFileNameWithExtension] = path;
        }
    };

    const projectRoot = await findRoot();
    let p = path.join(projectRoot, configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        cacheValue(p);
        return p;
    }

    p = path.join(projectRoot, srcDirName, configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        cacheValue(p);
        return p;
    }

    p = path.join(projectRoot, "config", configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        cacheValue(p);
        return p;
    }

    p = path.join(projectRoot, srcDirName, "config", configFileNameWithExtension);
    if (existsSync(p) && (await stat(p)).isFile()) {
        cacheValue(p);
        return p;
    }

    return null;
};
