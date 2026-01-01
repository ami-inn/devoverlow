import tickets from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// path :api/tickets/search?query=bug
// {query: 'bug'}

export async function GET(request:NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query')?.toLowerCase() || '';
    console.log("Search Query:", query);
    if(!query){
        return NextResponse.json(tickets);
    }

    const filteredTickets = tickets.filter((ticket) => 
        ticket.name.toLowerCase().includes(query) 
    // ||
        // ticket.status.toLowerCase().includes(query) ||
        // ticket.type.toLowerCase().includes(query)
    );

    return NextResponse.json(filteredTickets);


}