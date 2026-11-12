import { type SyntheticEvent } from 'react';
function handleImgFailed(e: SyntheticEvent<HTMLImageElement>, src: string) {
  e.currentTarget.src = src
}

export {handleImgFailed}