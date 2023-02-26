type EleventyPluginInterlinkOptions = {
    // defaultLayout is the optional default layout you would like to use for wrapping your embeds.
    defaultLayout?: string,

    // layoutKey is the front-matter value used for a per embed template, if found it will replace defaultLayout for
    // that embed. This will always default to `embedLayout`.
    layoutKey?: string,
}

export {EleventyPluginInterlinkOptions};