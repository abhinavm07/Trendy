const SearchResult = ({ emotion }) => {
  return (
    <div className='flex h-full w-full '>
      {emotion === 'Positive' ? (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
          <defs>
            <style>{'.cls-2{fill:#273941}.cls-5{fill:#f6fafd}'}</style>
          </defs>
          <g id='_03-smile' data-name='03-smile'>
            <circle cx={24} cy={24} r={23} fill='#ffce52' />
            <path
              className='cls-2'
              d='M24 39c-7.168 0-13-4.935-13-11h2c0 4.962 4.935 9 11 9s11-4.038 11-9h2c0 6.065-5.832 11-13 11zM20 21h-2c0-2.206-1.346-4-3-4s-3 1.794-3 4h-2c0-3.309 2.243-6 5-6s5 2.691 5 6zM38 21h-2c0-2.206-1.346-4-3-4s-3 1.794-3 4h-2c0-3.309 2.243-6 5-6s5 2.691 5 6z'
            />
            <path
              d='M24 4c12.15 0 22 8.507 22 19h.975a23 23 0 00-45.95 0H2C2 12.507 11.85 4 24 4z'
              fill='#ffe369'
            />
            <path
              d='M46 23c0 10.493-9.85 19-22 19S2 33.493 2 23h-.975c-.014.332-.025.665-.025 1a23 23 0 0046 0c0-.335-.011-.668-.025-1z'
              fill='#ffb32b'
            />
            <ellipse
              className='cls-5'
              cx={37}
              cy={9}
              rx={0.825}
              ry={1.148}
              transform='rotate(-45.02 37 9)'
            />
            <ellipse
              className='cls-5'
              cx={30.746}
              cy={4.5}
              rx={0.413}
              ry={0.574}
              transform='rotate(-45.02 30.745 4.5)'
            />
            <ellipse
              className='cls-5'
              cx={34}
              cy={7}
              rx={1.65}
              ry={2.297}
              transform='rotate(-45.02 34 7)'
            />
          </g>
        </svg>
      ) : emotion === 'Neutral' ? (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
          <defs>
            <style>
              {'.cls-2{fill:#273941}.cls-3{fill:#141e21}.cls-4{fill:#f6fafd}'}
            </style>
          </defs>
          <g id='_12-neutral' data-name='12-neutral'>
            <circle cx={24} cy={24} r={23} fill='#ffce52' />
            <ellipse className='cls-2' cx={33} cy={18} rx={3} ry={4} />
            <ellipse className='cls-2' cx={15} cy={18} rx={3} ry={4} />
            <ellipse className='cls-3' cx={33} cy={18} rx={2} ry={3} />
            <ellipse className='cls-3' cx={15} cy={18} rx={2} ry={3} />
            <circle className='cls-4' cx={34} cy={17} r={1} />
            <circle className='cls-4' cx={16} cy={17} r={1} />
            <path
              d='M24 4c12.15 0 22 8.507 22 19h.975a23 23 0 00-45.95 0H2C2 12.507 11.85 4 24 4z'
              fill='#ffe369'
            />
            <path
              d='M46 23c0 10.493-9.85 19-22 19S2 33.493 2 23h-.975c-.014.332-.025.665-.025 1a23 23 0 0046 0c0-.335-.011-.668-.025-1z'
              fill='#ffb32b'
            />
            <path className='cls-2' d='M16 32H32V34H16z' />
            <ellipse
              className='cls-4'
              cx={37}
              cy={9}
              rx={0.825}
              ry={1.148}
              transform='rotate(-45.02 37 9)'
            />
            <ellipse
              className='cls-4'
              cx={30.746}
              cy={4.5}
              rx={0.413}
              ry={0.574}
              transform='rotate(-45.02 30.745 4.5)'
            />
            <ellipse
              className='cls-4'
              cx={34}
              cy={7}
              rx={1.65}
              ry={2.297}
              transform='rotate(-45.02 34 7)'
            />
          </g>
        </svg>
      ) : emotion === 'Negative' ? (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
          <defs>
            <style
              dangerouslySetInnerHTML={{
                __html:
                  '.cls-1{fill:#cf4054;}.cls-2{fill:#f45269;}.cls-3{fill:#ae2d4c;}.cls-4{fill:#f6fafd;}.cls-5{fill:#141e21;}.cls-6{fill:#273941;}',
              }}
            />
          </defs>
          <title>28-angry</title>
          <g id='_28-angry' data-name='28-angry'>
            <circle className='cls-1' cx={24} cy={24} r={23} />
            <path
              className='cls-2'
              d='M24,4c12.15,0,22,8.507,22,19h.975a23,23,0,0,0-45.95,0H2C2,12.507,11.85,4,24,4Z'
            />
            <path
              className='cls-3'
              d='M46,23c0,10.493-9.85,19-22,19S2,33.493,2,23H1.025c-.014.332-.025.665-.025,1a23,23,0,0,0,46,0c0-.335-.011-.668-.025-1Z'
            />
            <ellipse
              className='cls-4'
              cx='36.5'
              cy='8.5'
              rx='0.825'
              ry='1.148'
              transform='translate(4.687 28.31) rotate(-45.02)'
            />
            <ellipse
              className='cls-4'
              cx='30.246'
              cy={4}
              rx='0.413'
              ry='0.574'
              transform='translate(6.037 22.567) rotate(-45.02)'
            />
            <ellipse
              className='cls-4'
              cx='33.5'
              cy='6.5'
              rx='1.65'
              ry='2.297'
              transform='translate(5.222 25.602) rotate(-45.02)'
            />
            <ellipse className='cls-3' cx={24} cy={25} rx={10} ry={2} />
            <path
              className='cls-5'
              d='M39.447,16.9l-.894-1.79-4.934,2.467h0l-2.927,1.464-.136.068.015.03a.982.982,0,0,0-.4.55A5.335,5.335,0,0,0,30,21c0,2.243,1.317,4,3,4s3-1.757,3-4a5.011,5.011,0,0,0-.483-2.14Z'
            />
            <path
              className='cls-5'
              d='M17.432,19.135l.015-.03-.136-.068-2.927-1.464h0L9.447,15.105,8.553,16.9l3.93,1.965A5.011,5.011,0,0,0,12,21c0,2.243,1.317,4,3,4s3-1.757,3-4a5.335,5.335,0,0,0-.168-1.315A.982.982,0,0,0,17.432,19.135Z'
            />
            <path
              className='cls-6'
              d='M16.86,19.93A4.07,4.07,0,0,1,17,21c0,1.66-.9,3-2,3s-2-1.34-2-3a3.516,3.516,0,0,1,.94-2.53Z'
            />
            <path
              className='cls-6'
              d='M35,21c0,1.66-.9,3-2,3s-2-1.34-2-3a4.07,4.07,0,0,1,.14-1.07l2.92-1.46A3.516,3.516,0,0,1,35,21Z'
            />
            <path
              className='cls-5'
              d='M31,36H29c0-1.812-2.23-4-5-4s-5,2.188-5,4H17c0-2.832,2.993-6,7-6S31,33.168,31,36Z'
            />
          </g>
        </svg>
      ) : (
        <div>{null}</div>
      )}
    </div>
  )
}

export default SearchResult
