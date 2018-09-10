const JSZip = require('jszip');
import { SessionData } from './types';

export default class FileManager {
    private static dataURItoBlob(dataURI) {
        const binary = atob(dataURI.split(',')[1]);
        const array = [];
        for(let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/webp'});
    }

    private static get structure() {
        return {
            date: Date.now(),
            imageDir: 'images',
            screens: []
        }
    }

    public static zipFiles(files: SessionData[]) {
        console.log('Zipping files');
        const zip = new JSZip();
        const baseSructure = { ...FileManager.structure };

        zip.folder('images');

        files.forEach((data: SessionData) => {
            const imageName = `${data.screen.tab}.webp`;
            zip.file(`${baseSructure.imageDir}/${imageName}`, FileManager.dataURItoBlob(data.screen.dataURI));

            baseSructure.screens.push({
                title: data.screen.tab,
                source: imageName,
                size: { ...data.screen.dimensions },
                area: { ...data.click.boundingRect }
            });
        });

        zip.file('data.json', JSON.stringify(baseSructure));

        zip.generateAsync({ type: 'blob' })
            .then((blob) => {
                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = `Flowshot-${Date.now()}.flowshot`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }
}