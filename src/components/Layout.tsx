import React, { FC, ReactNode } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"

type Props = {
  children: ReactNode
  title?: string
}

export const Layout: FC<Props> = ({ title = "禁煙ミテミル", children }) => {
  return (
    <div className='min-h-screen bg-gray-100 overflow-hidden'>
      <Head>
        <title>{title}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='bg-blue-500 shadow-lg w-full py-2 top-0 z-100'>
        <nav className='flex mx-5 items-center justify-between'>
          <h1 className='flex items-center'>
            <Image
              src='/favicon.ico'
              height={50}
              width={50}
              alt=''
              objectFit='contain'
              className='transform scale-140'
            />
            <span className='font-mono text-white ml-3'>禁煙ミテミル</span>
          </h1>
        </nav>
      </header>
      <main>
        <div className='mx-auto max-w-1150px px-2 pt-100px pb-70px break-words sm:pt-130px'>
          {children}
        </div>
      </main>
    </div>
  )
}