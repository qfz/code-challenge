/* eslint-disable react-refresh/only-export-components */
import { redirect } from "react-router"


/** This route doesn't render anything, it only redirects to /accounts */
export async function loader() {
  return redirect("/accounts");
}


export default function Home() {
  return <></>
}
