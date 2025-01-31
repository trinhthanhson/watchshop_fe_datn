import Layout from './components/Layout'
import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import ToastProvider from './redux/actions/ToastProvider'

function App() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible')
    }
  }, [isInView])
  return (
    <div ref={ref}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ToastProvider />
        <Layout />
      </motion.div>
    </div>
  )
}

export default App
