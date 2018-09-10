const JSZip = require('jszip');
import { SessionData } from './types';
import { Utils } from './Utils';

export default class FileManager {
    private static dataURItoBlob(dataURI) {
        const binary = atob(dataURI.split(',')[1]);
        const array = [];
        for(let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
    }

    private static get structure() {
        return {
            date: Date.now(),
            imageDir: 'assets',
            screens: []
        }
    }

    public static get overflowStructure() {
        const structure = {
            currentPage: '',
            styles: {},
            system_styles: {},
            themes: [],
            pages: {},
            settings: {
                jumpOverEnabled: false,
                themeName: 'system_theme_1',
                titlesEnabled: false,
                mapEnabled: false,
                polePositionVisible: false,
                playerFlightAnimationEnabled: true,
                grid: {
                    enabled: false,
                    snap: false,
                    tickSize: 40,
                },
                pageSizeFormat: {
                    w: 1323.2,
                    h: 1870.4,
                },
                deviceSize: {
                    w: 375,
                    h: 667,
                },
            },
            parsed: false
        };

        return { ...structure };
    }

    public static zipOverflow(files: SessionData[]) {
        console.log('Zipping files');
        const zip = new JSZip();
        const baseSructure = { ...FileManager.overflowStructure };

        const newPageId = Utils.newGUID();
        const newPage = {
            entities: {},
            title: `Flowshot-${Date.now()}`,
            settings: {},
            order: 1,
            hidden: false,
            flows: []
        };
        baseSructure.pages[newPageId] = newPage;
        baseSructure.currentPage = newPageId;

        zip.folder('preview');
        zip.folder('thumbs');
        zip.folder('assets');

        files.forEach((data: SessionData) => {
            const imageName = `${data.screen.tab}.png`;
            const newScreenId = Utils.newGUID();
            zip.file(`assets/${imageName}`, FileManager.dataURItoBlob(data.screen.dataURI));

            newPage.entities[newScreenId] = {
                id: newScreenId,
                caption: data.screen.tab,
                position: { x: 0, y: 0 },
                source: {
                    id: imageName,
                },
                size: { ...data.screen.dimensions },
                area: { ...data.click.boundingRect }
            };
        });

        zip.file('overflow_data.json', JSON.stringify(baseSructure));
        zip.file('file_info.json', JSON.stringify({
            "version": {
                "appBundleId": "io.overflow.mac.app",
                "appVersion": "0.6.4-beta",
                "appVersionName": "Overflow 0.6.4 beta",
                "appVersionUUID": "CB26F07B-0198-4451-9535-B16A1F265979",
                "platform": "darwin_x64"
            }
        }));

        zip.generateAsync({ type: 'blob' })
            .then((blob) => {
                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = `Flowshot-${Date.now()}.overflow`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }

    public static zipFiles(files: SessionData[]) {
        console.log('Zipping files');
        const zip = new JSZip();
        const baseSructure = { ...FileManager.structure };

        zip.folder(baseSructure.imageDir);

        files.forEach((data: SessionData) => {
            const newScreenId = Utils.newGUID();
            const imageName = `${newScreenId}.png`;
            zip.file(`${baseSructure.imageDir}/${imageName}`, FileManager.dataURItoBlob(data.screen.dataURI));

            baseSructure.screens.push({
                id: newScreenId,
                title: `${data.screen.tab} - ${Date.now()}`,
                source: imageName,
                size: { ...data.screen.dimensions },
                position: {
                    x: 0,
                    y: 0,
                },
                area: {
                    id: Utils.newGUID(),
                    position: {
                        x: data.click.boundingRect.x * 2,
                        y: data.click.boundingRect.y * 2
                    },
                    size: {
                        height: data.click.boundingRect.h * 2,
                        width: data.click.boundingRect.w * 2,
                    }
                }
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