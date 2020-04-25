/* btoa doesn't play nice with unicode... */
export function encodeToBase64(string) {
    return btoa(String.fromCharCode(...new TextEncoder().encode(string)));
}

export function decodeFromBase64(encoded) {
    function toBytes(binary) {
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }
    return new TextDecoder().decode(toBytes(atob(encoded)));
}
