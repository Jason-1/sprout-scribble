import Image from "next/image";

export default function Home() {
  return (
    <main>
      <h1>Welcom to Next.js</h1>
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={72}/>
    </main>
  );
}
