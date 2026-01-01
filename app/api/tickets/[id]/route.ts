import tickets from "@/app/database";

// get by id
// put underscore to ignore unused variable warning
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticket = tickets.find((t) => t.id === parseInt(id));
  if (ticket) {
    return new Response(JSON.stringify(ticket), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: "Ticket not found" }), {
      status: 404,
    });
  }
}

// update by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, status, type } = await request.json();

  const ticketIndex = tickets.findIndex((t) => t.id === parseInt(id));
  if (ticketIndex !== -1) {
    if (name) tickets[ticketIndex].name = name;
    if (status) tickets[ticketIndex].status = status;
    if (type) tickets[ticketIndex].type = type;
    return new Response(JSON.stringify(tickets[ticketIndex]), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: "Ticket not found" }), {
      status: 404,
    });
  }
}

// delete by id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ticketIndex = tickets.findIndex((t) => t.id === parseInt(id));
  if (ticketIndex !== -1) {
    const deletedTicket = tickets.splice(ticketIndex, 1);
    return new Response(JSON.stringify(deletedTicket[0]), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: "Ticket not found" }), {
      status: 404,
    });
  }
}