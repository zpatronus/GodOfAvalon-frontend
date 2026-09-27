import backgroundUrl from '@/assets/avalon-island.webp'
import { cachedImage, cacheImage, forgetImage } from '@/imageCache'

export function loadBackground () {
  const filename = 'avalon-island.webp'
  let source = cachedImage(filename, backgroundUrl) || backgroundUrl
  const image = new Image()
  const apply = () => {
    document.documentElement.style.setProperty('--avalon-background', `url("${source}")`)
    image.src = source
  }
  image.onload = () => {
    if (source === backgroundUrl) cacheImage(filename, backgroundUrl)
  }
  image.onerror = () => {
    if (source !== backgroundUrl) {
      forgetImage(filename)
      source = backgroundUrl
      apply()
    }
  }
  apply()
}
