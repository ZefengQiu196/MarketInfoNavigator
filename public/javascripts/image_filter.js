/*
* VisImageNavigator V1.0 (https://github.com/VisImageNavigator/VisImageNavigator.Release)
* Copyright 2020-2022 Rui Li, Department of Computer Science and Engineering, The Ohio State University.
* Licensed under MIT (https://github.com/VisImageNavigator/VisImageNavigator.Release/blob/main/LICENSE)
* To cite this work: Jian Chen, Meng Ling, Rui Li, Petra Isenberg, Tobias Isenberg, Michael Sedlmair, Torsten Möller, Robert S. Laramee, Han-Wei Shen, Katharina Wünsche, and Qiru Wang. VIS30K: A Collection of Figures and Tables from IEEE Visualization Conference Publications. IEEE Transactions on Visualization and Computer Graphics (2021).
*/

/**
 * Filter the dataset by searching conditions
 */

var figureIndex = [-1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 50, 51, 100];
var tableIndex = [16];
var algoIndex = [18];
var equaIndex = [19];

/**
 * find all keywords
 * @param data
 */
// function getAllKeywords(data) {
//     var keyword_list = [];
//     for (let i = 0; i < data.length; i++) {
//         let keywords = data[i]["Keywords Author"].split(/[;,]+/);
//         for (let j = 0; j < keywords.length; j++) {
//             keyword_list.push(keywords[j].toLowerCase());
//         }
//     }
//     var uniq_keywords = [...new Set(keyword_list)];
//     uniq_keywords = uniq_keywords.sort();
//     return uniq_keywords;
// }

// function getAllKeywords(data) {
//     var keyword_list = [];
//     for (let i = 0; i < data.length; i++) {
//         if (searchMode == 1) {
//             let keywords = data[i]["Keywords Author"].split(/[;,]+/);
//             keyword_list = keyword_list.concat(keywords);
//         } else if (searchMode == 2) {
//             // let titleKeywords = data[i]['Paper Title'].split(/[\s,;]+/);
//             let abstractKeywords = data[i]['Strain'].split(/[\s,;]+/);
//             keyword_list = keyword_list.concat(abstractKeywords);
//         }
//     }
//     var uniq_keywords = [...new Set(keyword_list.map(word => word.trim().toLowerCase()))];
//     return uniq_keywords.sort();
// }


// function getAllKeywords(data) { 
//     let keywordSet = new Map(); 

//     for (let i = 0; i < data.length; i++) {
//         if (!data[i]) continue; 
//         console.log('begin load sth',i)
//         let keywords = [];
//         if (searchMode == 1) {
//             keywords = data[i]["Keywords Author"] ? data[i]["Keywords Author"].split(/[;,]+/) : [];
//         } else if (searchMode == 2) {
//             keywords = data[i]['Strain'] ? data[i]['Strain'].split(/[\s,;]+/) : [];
//         }

//         for (let word of keywords) {
//             word = word.trim().toLowerCase();
//             if (word) keywordSet.set(word, (keywordSet.get(word) || 0) + 1); 
//         }
//     }

//     let sortedKeywords = Array.from(keywordSet.keys()).sort();
//     return sortedKeywords;
// }

function getAllKeywords(data) { 
    let keywordDict = Object.create(null); 
    let isAuthorMode = searchMode === 1;

    for (let i = 0; i < data.length; i++) {
        if (!data[i]) continue; 

        let rawKeywords = isAuthorMode 
            ? (data[i]["Keywords Author"] ? data[i]["Keywords Author"].split(/[;,]+/) : [])
            : (data[i]['Strain'] ? data[i]['Strain'].split(/[\s,;]+/) : []);

        for (let j = 0; j < rawKeywords.length; j++) {
            let word = rawKeywords[j];
            if (!word) continue;
            
            word = word.trim().toLowerCase();
            if (!keywordDict[word]) {
                keywordDict[word] = true; 
            }
        }
    }

    let sortedKeywords = Object.keys(keywordDict).sort();
    return sortedKeywords;
}




function getAllAuthors(data) {
    var author_list = [];
    for (let i = 0; i < data.length; i++) {
        let authors = data[i]["Author"].split(';');
        for (let j = 0; j < authors.length; j++) {
            if (authors[j] == 'Torsten Möller') {
                authors[j] = 'Torsten Möller';
            }
            author_list.push(authors[j]);
        }
    }
    var uniq_authors = [...new Set(author_list)];
    return uniq_authors;
}

/**
 * return a subset of datasets based on the given keyword
 * @param keyword
 */
// function filterDataByKeywords(data, keyword) {
//     if (searchMode == 1) {
//         var filterData = data.filter(function(item) {
//             //console.log(item['Keywords Author']);
//             return item['Keywords Author'].toLowerCase().includes(keyword);
//         });
//         //console.log(filterData);
//         return filterData;
//     } else if (searchMode == 2) {

//         //1. using regex: \b token \b to filter paper dois
//         //regex testing: https://regex101.com/
//         var filterPaper = G_PAPER.filter((item) => {
//                 let paragraph = (item['Title'] + ' ' + item['Abstract']).toLowerCase();
//                 let regex = new RegExp("\\b" + keyword + "\\b");
//                 //let regex = new RegExp(keyword);
//                 let found = paragraph.match(regex);
//                 return found != null;
//             })
//             .map((obj) => {
//                 return obj['DOI'];
//             });
//         //console.log(filterPaper);
//         //2. based on paper dois to get the images
//         var filterData = data.filter(function(item) {
//             //console.log(item['Keywords Author']);
//             return filterPaper.includes(item['Paper DOI']);
//         });
//         //console.log(filterData);
//         return filterData;
//     }
// }

function filterDataByKeywords(data, keyword) {
    if (searchMode == 1) {
        // in paper authors' keywords 
        var filterData = data.filter(function(item) {
            return item['Keywords Author'].toLowerCase().includes(keyword.toLowerCase());
        });
        return filterData;
    } else if (searchMode == 2) {
        // in title & abstract 
        var filterData = data.filter(function(item) {
            // let paragraph = (item['Paper Title'] + ' ' + item['Strain']).toLowerCase();
            let paragraph = (item['Strain']).toLowerCase();
            return paragraph.includes(keyword.toLowerCase());
        });
        return filterData;
    }
}
/**
 * return a subset of datasets based on the given authors
 * @param {} data 
 * @param {*} author 
 */
function filterDataByAuthors(data, author) {
    var filterData = data.filter(function(item) {
        let authorList = swapArrayString(item['Author'].split(';'));
        return authorList.includes(author);
    });
    return filterData;
}

/**
 * return a subset of datasets based on the given figure types
 * Figure, Table, Algorithm (18), Equation
 * @param {*} data 
 * @param {*} type 
 */
function filterDataByFigureType(data, type) {

    //create an array to store all types digits based on type
    var typeList = [];
    type.forEach((d, i) => {
        if (d == "Figure") {
            typeList = typeList.concat(figureIndex);
        }
        if (d == "Table") {
            typeList = typeList.concat(tableIndex);
        }
        if (d == "Algorithm") {
            typeList = typeList.concat(algoIndex);
        }
        if (d == "Equation") {
            typeList = typeList.concat(equaIndex);
        }
    });
    //console.log(typeList);
    var filterData = data.filter(function(item) {
        return typeList.includes(parseInt(item['vis_type']));
    });
    return filterData;
}

/**
 * given the encoding type, filter the data
 * the basic idea is for each data item, check if the encoding_type includes any of the selected types
 * if there is no type selected, return the full dataset
 * @param {*} data 
 * @param {*} type 
 */
function filterDataByEncodingType(data, type){
    if(type.length == 0){
        return data;
    }
    var filterData = data.filter(function(item){
        let isFlag = false;
        if(parseInt(item['check_encoding_type']) == 1){
            for(let i = 0; i < type.length; i++){
                if(item['encoding_type'].split(';').includes(type[i])){
                    isFlag = true;
                    break;
                }
            }
        }
        return isFlag;
    });
    return filterData;
}

/**
 * filter dataset by functional type
 * @param {*} data 
 * @param {*} type 
 * @returns 
 */
function filterDataByFunctionType(data, type){
    if(type.length == 0){
        return data;
    }
    var filterData = data.filter(function(item){
        let isFlag = false;
        if(parseInt(item['check_encoding_type']) == 1){
            for(let i = 0; i < type.length; i++){
                if(item['encoding_type'].split(';').includes(type[i])){
                    isFlag = true;
                    break;
                }
            }
        }
        return isFlag;
    });
    return filterData;
}

/**
 * filter data by hardness
 * @param {*} data 
 * @param {*} hardness 
 * @returns 
 */
function filterDataByHardness(data, hardness) {
    if(hardness == ''){
        return data;
    }
    else{
        var filterData = data.filter(function(item) {
            return hardness == item['hardness_type'];
        });
        return filterData;
    }
}


function filterDataByDimensions(data, type){
    if(type.length == 0){
        return data;
    }
    var filterData = data.filter(function(item){
        let isFlag = false;
        if(parseInt(item['check_dim_type']) == 1){
            for(let i = 0; i < type.length; i++){
                if(item['dim_type'].split(';').includes(type[i])){
                    isFlag = true;
                    break;
                }
            }
        }
        return isFlag;
    });
    return filterData;
}

function filterDataByComposition(data, type){
    if(type.length == 0){
        return data;
    }
    var filterData = data.filter(function(item){
        let isFlag = false;
        if(parseInt(item['check_comp_type']) == 1){
            for(let i = 0; i < type.length; i++){
                if(item['comp_type'].split(';').includes(type[i])){
                    isFlag = true;
                    break;
                }
            }
        }
        return isFlag;
    });
    return filterData;
}

function filterDataByNest(data, type){
    if(type.length == 0){
        return data;
    }
    var filterData = data.filter(function(item){
        let isFlag = false;
        if(parseInt(item['check_nest_type']) == 1){
            for(let i = 0; i < type.length; i++){
                if(item['nest_type'].split(';').includes(type[i])){
                    isFlag = true;
                    break;
                }
            }
        }
        return isFlag;
    });
    return filterData;
}

/**
 * 
 * @param {} data 
 * @param {*} type 
 */
function filterDataByAlgoEquaType(data, type) {
    if (type.length == 2) {
        var filterData = data.filter(function(item) {
            let boolean = parseInt(item['vis_type']) == 18 || parseInt(item['vis_type']) == 19;
            return boolean;
        });
        return filterData;
    } else if (type.length == 0) {
        var filterData = data.filter(function(item) {
            let boolean = parseInt(item['vis_type']) != 18 && parseInt(item['vis_type']) != 19;
            return boolean;
        });
        return filterData;
    } else if (type.length == 1) {
        if (type[0] == 'Algorithm') {
            var filterData = data.filter(function(item) {
                let boolean = parseInt(item['vis_type']) == 18;
                return boolean;
            });
            return filterData;
        } else if (type[0] == 'Equation') {
            var filterData = data.filter(function(item) {
                let boolean = (parseInt(item['vis_type']) == 19);
                return boolean;
            });
            return filterData;
        }
    }
}


/**
 * return conference subset
 * @param {selected conferences} confs 
 */
function filterDataByConference(data, confs) {
    var filterData = data.filter(function(item) {
        return confs.includes(item['Conference']);
    });
    return filterData;
}

/**
 * return image dataset with the year range
 * @param {*} minYear 
 * @param {*} maxYear 
 */
function filterDataByYear(data, minYear, maxYear) {
    var filterData = data.filter(function(item) {
        return (minYear <= item['Year']) & (item['Year'] <= maxYear);
    });
    return filterData;
}