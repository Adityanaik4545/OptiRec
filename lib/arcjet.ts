import arcjet, {
    detectBot,
    fixedWindow,
    shield,
    request,
    validateEmail,
    slidingWindow,
    ArcjetDecision,
    createMiddleware
} from "@arcjet/next";
import { getEnv } from "./utils";

export {
    detectBot,
    fixedWindow,
    shield,
    request,
    validateEmail,
    slidingWindow,
    createMiddleware,
    ArcjetDecision,

}

const aj = arcjet({
    key: getEnv('ARCJET_API_KEY'),
    rules:[],
})

export default aj;