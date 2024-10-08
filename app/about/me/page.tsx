import Link from "next/link";


export default function Me() {
    return (
        <div>
            <h1>Me</h1>
            <Link href="/about">Return to About</Link>
        </div>
    )
}