import { NextResponse, NextRequest } from "next/server";

import { supabase } from '@/utils/supabase';
import Product from '@/app/api/models/productModel';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const id = searchParams.get('id');
        let response;
        if(id != null){
            response = await supabase
                .from('products')
                .select()
                .eq('id', id)
            return NextResponse.json({status: "OK", msg: `Get Product ${id}`, data: response?.data});
        }
        else{
            response = await supabase
                .from('products')
                .select()
                .order('title', { ascending: true })
            return NextResponse.json({status: "OK", msg: `Get Product`, data: response?.data});
        }
     
    }
    catch {
        return NextResponse.json({status: "Failed", msg: "Error"});
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body:Products = await req.json();
        const price = body.price as number;
        const title = body.title as string
        if(isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is not number"}, {status: 400});
        }
        const resultAlreadyExists = await supabase
            .from('products')
            .select()
            .eq('title', body.title)
        if (resultAlreadyExists.data!.length! > 0){
            return NextResponse.json({status: "Failed",  msg: "product already exist", data: resultAlreadyExists.data!}, {status: 400});
        }

        const dataProduct = {         
            title: title,
            price : price,
            userid: null,
            enrolldate: null,
            rowstatus: true
        }
        const { data, error }  = await supabase
            .from('products')
            .insert(dataProduct)
            .select()
        if(error != null){
            return NextResponse.json({ status: "error", msg: error?.message }, { status: 400 });
        }
        return NextResponse.json({status: "OK", msg: "Product Created", data: data}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: "error"}, {status: 400});
    }
}

export async function PATCH(req: NextRequest, res: NextResponse){
    try {
        const body:Products = await req.json();
        const price = body.price as number;
        if (isNaN(price)){
            return NextResponse.json({status: "Failed", msg: "Price is NaN"}, {status: 400});
        }
        const { data, error } = await supabase
            .from("products")
            .update({ title: body.title, price: price, rowstatus: true })
            .eq("id", body.id)
            .select()

        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error update data"}, {status: 400});
        }
        return NextResponse.json({status: "OK", msg: `Product ${body.id} Updated`, data: data}, {status: 200});
        
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 400});
    }
}

export async function DELETE(req: NextRequest, res: NextResponse){
    try {
        const body:Products = await req.json();
        const { data, error, count } = await supabase
            .from("products")
            .update({rowstatus: false})
            .eq("id", body.id)
        if(error != null){
            return NextResponse.json({status: "Failed", msg: "Error delete data"}, {status: 400});
        }
        if(count! <= 0){
            return NextResponse.json({status: "Failed", msg: `Data is not exists`}, {status: 300});
        }
        return NextResponse.json({status: "OK", msg: `Product ${body.id} Deleted`}, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error}, {status: 300});
    }
}