'use strict'
const vscode = require('vscode')

function PageNameGenerator(label) {

    console.log(`PageNameGen: ${label}`)

    return label.split('/').map(function(pathSegment) {

        // remove file path extension
        pathSegment = pathSegment.replace(/\.[^/.]+$/, "");

        // escape spaces in the filename
        pathSegment = pathSegment.replace(/ /g, '%20');

        return pathSegment;

    }).join('/');
}

function postProcessPageName(pageName) {

    console.log(`postprocess: ${pageName}`)

    return pageName.replace(/\|/g, '').trim();
}

function postProcessLabel(label) {
    console.log(`postprocesslabel : ${label}`)

    label = label.trim();

    if (vscode.workspace.getConfiguration("markdown-wiki-links-preview").get('showextension')) {
        label += vscode.workspace.getConfiguration("markdown-wiki-links-preview").get('urisuffix');
    }

    switch (vscode.workspace.getConfiguration("markdown-wiki-links-preview").get('previewlabelstyling')) {
        case "[[label]]":
            return `[[${label}]]`;
        case "[label]":
            return `[${label}]`;
        case "label":
            return label;
    }
    ;
}


function activate(context) {
    return {
        extendMarkdownIt(md) {
            return md.use(

                require('@thomaskoppelaar/markdown-it-wikilinks')({
                    generatePageNameFromLabel: PageNameGenerator,
                    postProcessPageName: postProcessPageName,
                    postProcessLabel: postProcessLabel,
                    uriSuffix: `${vscode.workspace.getConfiguration("markdown-wiki-links-preview").get('urisuffix')}`,
                    description_then_file: vscode.workspace.getConfiguration("markdown-wiki-links-preview").get("descriptionthenfile"),
                    separator: vscode.workspace.getConfiguration("markdown-wiki-links-preview").get("WikiLinksSeparator"),
                }));
        }
    };
}

exports.activate = activate;
exports.PageNameGenerator = PageNameGenerator;
exports.postProcessPageName = postProcessPageName;
exports.postProcessLabel = postProcessLabel;
