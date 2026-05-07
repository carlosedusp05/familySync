function ErrorForms({ erro }) {
  let hidden = "";
  if (erro == "") {
    hidden = "hidden";
  } else {
    hidden = "";
  }
  return (
    <div
      className={`p-5 rounded-2xl font-bold bg-[#ffdddd] text-red-400 ${hidden} text-[18px]`}
    >
      <p>{erro}</p>
    </div>
  );
}

export default ErrorForms;
