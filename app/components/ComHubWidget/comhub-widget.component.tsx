import { links } from '@/app/utils'
import Image from 'next/image'
import Link from 'next/link'

export const ComHubWidget = () => {

    return (
      <div className='lg:max-w-11/12 mt-7 flex w-full flex-col items-center justify-between rounded-2xl bg-transparent p-6 shadow-xl md:flex-row md:items-center lg:flex-col lg:items-center lg:px-6 xl:flex-row'>
        <div className='flex flex-col items-center justify-center md:flex-row lg:flex-col xl:flex-row'>
          <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-black to-gray-900/50 p-1.5 shadow-xl md:mb-0 md:mr-3 lg:mb-2 lg:mr-0 xl:mb-0 xl:mr-3'>
            <Image
              src='/comhub.png'
              priority
              width={25}
              height={25}
              alt='commune logo'
              className='mx-auto'
            />
          </div>
          <div className=' flex-col md:flex lg:items-center xl:items-start'>
            <span className='font-bold text-white'>ComHub</span>
            <div className='flex flex-col items-center sm:flex-row'>
              <div className='flex items-center'>
                {/* <span className='mr-1 inline-block h-3 w-3 rounded-full bg-green-500' /> */}
                <span className='text-shad w-auto text-sm text-gray-100'>
                  {/* {moduleCount} Modules */}
                  The hub for all commune ai modules
                </span>
              </div>
            </div>
          </div>
        </div>

        <Link
          className='relative hover:animate-scale-up-sm'
        //   href={data.instant_invite || links.discord}
            href={links.comhub}
          target='_blank'
          rel='noopener noreferrer'
        >
          {/* <span className='absolute right-0 mt-[10px] inline-block h-3 w-3 animate-ping rounded-full bg-gradient-to-br from-indigo-500 to-gray-100 md:mt-0 lg:mt-2 xl:mt-0' /> */}
          {/* <span className='absolute right-0 mt-[10px] inline-block h-3 w-3 rounded-full bg-gradient-to-br from-indigo-500 to-gray-100 md:mt-0 lg:mt-2 xl:mt-0' /> */}
          <button className='mt-3 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-800 px-4 py-3 text-sm font-medium text-white hover:from-indigo-500 hover:to-blue-900 md:mt-0 lg:mt-3 xl:mt-0'>
           Explore
          </button>
        </Link>
      </div>
    )
}
