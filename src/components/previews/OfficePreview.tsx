import type { OdFileObject } from '../../types'
import { FC, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import DownloadButtonGroup from '../DownloadBtnGtoup'
import { DownloadBtnContainer } from './Containers'
import { getBaseUrl } from '../../utils/getBaseUrl'
import { getStoredToken } from '../../utils/protectedRouteHandler'

const OfficePreview: FC<{ file: OdFileObject }> = ({ file }) => {
  const { asPath } = useRouter()
  const hashedToken = getStoredToken(asPath)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [containerWidth, setContainerWidth] = useState(600)

  const docUrl = encodeURIComponent(
    `${getBaseUrl()}/api/raw/?path=${asPath}${hashedToken ? `&odpt=${hashedToken}` : ''}`
  )

  useEffect(() => {
    const updateWidth = () => {
      if (iframeRef.current?.parentElement) {
        setContainerWidth(iframeRef.current.parentElement.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div>
      <div className="overflow-scroll" style={{ maxHeight: '90vh' }}>
        <iframe
          ref={iframeRef}
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${docUrl}`}
          width={containerWidth}
          height="600"
          frameBorder="0"
          allowFullScreen
          title="Office Document Preview"
        />
      </div>
      <DownloadBtnContainer>
        <DownloadButtonGroup />
      </DownloadBtnContainer>
    </div>
  )
}

export default OfficePreview
