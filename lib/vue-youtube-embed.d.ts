import Vue, { ComponentOptions, PluginObject } from 'vue'

export type Options = {
    global?: boolean
    componentId?: string
}

declare const index: PluginObject<Options>

export default index

export const YouTubePlayer: ComponentOptions<Vue>

export function getIdFromURL(url: string): string

export function getTimeFromURL(url: string): string
