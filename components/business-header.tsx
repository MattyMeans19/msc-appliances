import Logo from '@/public/MSC-logo.png'
import Image from 'next/image'

export default function BusinessHeader(){
    return(
        <div className='flex flex-wrap justify-around border-b-5 border-red-500 pb-2'>
            <Image 
                width={150}
                height={150}
                src={Logo}
                alt='MSC Logo'
            />
            <h1 className='text-4xl place-content-center text-center'>Metro Service Company LLC Business Portal</h1>
        </div>
    )
}