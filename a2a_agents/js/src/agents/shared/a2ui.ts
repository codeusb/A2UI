
import { Message, Part, DataPart } from "@a2a-js/sdk";
import { RequestContext } from "@a2a-js/sdk/server";

export const A2UI_EXTENSION_URI = "https://a2ui.org/a2a-extension/a2ui/v0.8";

export const MIME_TYPE_KEY = "mimeType";
export const A2UI_MIME_TYPE = "application/json+a2ui";

export const A2UI_CLIENT_CAPABILITIES_KEY = "a2uiClientCapabilities";
export const SUPPORTED_CATALOG_IDS_KEY = "supportedCatalogIds";
export const INLINE_CATALOGS_KEY = "inlineCatalogs";

export const STANDARD_CATALOG_ID = "https://github.com/google/A2UI/blob/main/specification/0.8/json/standard_catalog_definition.json";

/**
 * Creates an A2A Part containing A2UI data.
 */
export function createA2UIPart(a2uiData: any): Part {
    return {
        kind: 'data',
        data: a2uiData,
        metadata: {
            [MIME_TYPE_KEY]: A2UI_MIME_TYPE,
        },
    };
}

/**
 * Checks if an A2A Part contains A2UI data.
 */
export function isA2UIPart(part: Part): boolean {
    return (
        part.kind === 'data' &&
        !!part.metadata &&
        part.metadata[MIME_TYPE_KEY] === A2UI_MIME_TYPE
    );
}

/**
 * Extracts the DataPart containing A2UI data from an A2A Part, if present.
 */
export function getA2UIDataPart(part: Part): DataPart | null {
    if (isA2UIPart(part)) {
        return part as DataPart;
    }
    return null;
}


/**
 * Extracts supported catalog IDs from the request context.
 * 
 * It looks for the A2UI extension capabilities in the active extensions data.
 */
export function extractSupportedCatalogs(context: RequestContext): string[] {
    // Check if extension is requested/activated could be a first step, 
    // but usually we care if the capability data is present.

    // In A2A JS SDK, extension data might be in context.extensions or similar depending on where it's populated.
    // Assuming the `extensions` parameter in `Message` or `hello` contains the data which is mapped to context.
    // If `RequestContext` doesn't strictly have a type for extensions yet, we might need to inspect `userMessage.metadata`.
    // However, A2A protocol usually passes extension params in the `capabilities` or `extensions` field of the handshake/message.

    // Based on `a2ui_extension.py` logic, specific keys are looked up.
    // For now, let's assume the extension data might be available in `context.context_data` or `context.extensionParams` 
    // IF the SDK surfaces it. 
    // Since we are writing a pilot, let's look in `userMessage.metadata` as a fallback or 
    // ideally `context.params` if it existed.

    // Real implementation detail: In current A2A JS SDK `RequestContext`, we primarily have `userMessage`.
    // The capabilities should be in `userMessage.metadata` if not top-level.
    // Or they might be in `context.client` if handshake stored it.

    // Let's defer to looking at `userMessage.metadata` for a key like `extensions` or direct `a2uiClientCapabilities`.
    // If the Python server puts it in `extension_data` map, we need to know where JS SDK puts it.
    // Assuming `userMessage.metadata` for now as a safe transport for custom fields.

    const metadata = context.userMessage.metadata || {};

    // Check for the extension specific capability object
    const a2uiCaps = metadata[A2UI_CLIENT_CAPABILITIES_KEY];

    if (a2uiCaps && typeof a2uiCaps === 'object') {
        const ids = (a2uiCaps as any)[SUPPORTED_CATALOG_IDS_KEY];
        if (Array.isArray(ids)) {
            return ids;
        }
    }

    return [];
}
