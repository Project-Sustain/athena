export function getAuth() {
    const hash = 'hiq`mwNvqxNNvK6jN[PyN2ZJ8jX5I7KQ8L3SfI38';
    let auth = '';
    [...hash].forEach(char => auth += String.fromCharCode(char.charCodeAt(0) - 1));
    return auth;
}