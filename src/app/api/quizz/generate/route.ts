import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {JsonOutputFunctionsParser} from "langchain/output_parsers";
import { Description } from "@radix-ui/react-dialog";
import saveQuizz from "./saveToDb";


export async function POST(req:NextRequest){
    const body = await req.formData();
    const document = body.get('pdf');

    try{
        const pdfLoader = new PDFLoader(document as Blob,{
            parsedItemSeparator : " "
        });
        const docs = await pdfLoader.load();

        const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
        const texts = selectedDocuments.map((doc) => doc.pageContent);

        const prompt = "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quiz object with field:name,description and questions. The questions is an array of objects with fields : questionText , answers. The answers is an array of objects with fields: answerText, isCorrect"

        if(!process.env.GEMINI_API_KEY){
            return NextResponse.json({ error:"Gemini API key not provided"},{status:500});
        }

        const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!,
        model: "models/gemini-2.0-flash",
        temperature: 0.7,
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
        name: "extractor",
        description: "Extracts fields from the output",
        parameters: {
            type: "object",
            properties: {
            quizz: {
                type: "object",
                properties: {
                name: { type: "string" },
                description: { type: "string" },
                questions: {
                    type: "array",
                    items: {
                    type: "object",
                    properties: {
                        questionText: { type: "string" },
                        answers: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                            answerText: { type: "string" },
                            isCorrect: { type: "boolean" },
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            },
        },
        };

    const runnable = model.bind({
        functions: [extractionFunctionSchema],
        function_call: {name:"extractor"},
    })
    .pipe(parser);

    const message = new HumanMessage({
        content:[
            {
                type: "text",
                text:prompt + "\n" + texts.join("\n")
            }
        ]
    })

    const result = await runnable.invoke([message]);
    console.log(result);

    const{quizzId} = await saveQuizz(result.quizz);

    return NextResponse.json({quizzId},{status:200});
    }
    catch(e:any){
        return NextResponse.json({ error: e.message},{status:500});
    }
}