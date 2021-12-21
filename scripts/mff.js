import {functionsRegister} from "./mff_core.js";

const functionCalls = /\@([A-Za-z]*) ([^@]*)/gm // func name, params
const literals = /\!(([A-Za-z0-9]*)([a-z]))|(\"[^\"]*\")/g // literal value, type
const reference = /\&([A-Za-z0-9]*)((\[[A-Za-z0-9\&]+\])*)/g //var name, indices
const referenceIndex = /\&?([A-Za-z0-9]+)/g //int value or reference
//TODO: give defaults
const parseFile = (fileName: String, state: Object, path: String) => {
    fetch(path + fileName).then(
        e => e.toJson().then(file => {
            let fileContents = file.split("\n")
            for(let i = 0; i < fileContents.length; i++) {
                if (fileContents[i].trim() === "" || fileContents[i].trim().startsWith(';')) continue;
                engine.state.cursor = 0;
                
                let functions = functionCalls.exec(fileContents[i])
                for(let j = 0; j < functions.length; j++) {

                }

            }
            Engine.onComplete()
        })
    );
}

const Engine = () => {}

Engine._internals = {
    state: {engine: Engine, cursor: 0},
    output: {},
    onComplete: () => {}
}

Engine.get = (index: String) => Engine._internals.state[index];
Engine.set = (index: String, value: Object) => Engine._internals.state[index] = value
// clearing out prev state and adding in new state
Engine.update = (state: Object) => Engine._internals = {state: {engine: Engine, cursor: 0, ...state}, output: {}}
Engine.run = (fileName: String, path: Sring) => parseFile(fileName, Engine._internals.state, path)
Engine.setOnComplete(func: Function) => Engine.onComplete = func


export default Engine;