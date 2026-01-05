




const Question = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>question page {id}</div>;
};

export default Question;
