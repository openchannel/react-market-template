import 'nprogress/nprogress.css'
import NProgress from 'nprogress';
import axios from 'axios';

const calculatePercentage = (loaded: number, total: number) => (Math.floor(loaded * 1.0) / total)

export const initProgressBar = (config = { showSpinner: false }, instance = axios) => {
  let requestsCounter = 0

  const setupStartProgress = () => {
    axios.interceptors.request.use(config => { 
      requestsCounter++
      NProgress.start()
      return config
    })
  }

  const setupUpdateProgress = () => {
    const update = (e: { loaded: number; total: number; }) => NProgress.inc(calculatePercentage(e.loaded, e.total));
    instance.defaults.onDownloadProgress = update;
    instance.defaults.onUploadProgress = update;
  }

  const setupStopProgress = () => {
    const responseFunc = (response: any) => {
      if ((--requestsCounter) === 0) {
        NProgress.done()
      }
      return response
    }

    const errorFunc = (error: any) => {
      if ((--requestsCounter) === 0) {
        NProgress.done()
      }
      return Promise.reject(error)
    }

    axios.interceptors.response.use(responseFunc, errorFunc)
  }

  NProgress.configure(config)
  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()
} 
