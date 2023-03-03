type EleventyPluginFontSubsettingOptions = {
    // dist is the destination path for the subset fonts, when set 11ty
    // is configured to addPassthroughCopy this path. If not set then
    // the subset fonts will be output in their source path dir.
    dist?: string

    // enabled when set to false will disable running of the plugin, this
    // is useful for programmatically deciding which environment you
    // want font subsetting to run.
    enabled?: boolean

    // srcFiles is a list of source file pathnames, it must contain at
    // least one item.
    srcFiles: Array<string>

    // cache is an object able to store and retrieve values with a TTL.
    // If not set then the plugin will default to an in memory cache.
    cache?: CacheInterface

    // cacheKey is the key to be used for caching, defaults to "font-subsetting"
    cacheKey ?: string
}

interface CacheInterface {
    has(key: string): any;

    get(key: string): any;

    set(key: string, value: any, ttl?: number)
}

export {EleventyPluginFontSubsettingOptions, CacheInterface};