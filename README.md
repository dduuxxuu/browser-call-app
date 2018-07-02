
### install
```javascript
npm install browser-call-app -S
```
### use
```javascript
import callUpApp from 'browser-call-app'

callUpApp.init(appConfig)
  .then(() => {
    // code
  })
  .catch(() => {
    // code
  })
```
### desc
```javascript
const appConfig = {
  // protocal
  PROTOCAL: 'xxxx',
  // app home page
  HOME: 'xxxxxx',
  // android apk info
  APK_INFO: {
    PKG: "xxx",
    CATEGORY: "android.intent.category.DEFAULT",
    ACTION: "android.intent.action.VIEW"
  },
  // link for fail
  FAILBACK: 'xxx'
  // timeout
  LOAD_WAITING: 3000
}
```
### more info
https://github.com/AlanZhang001/H5CallUpNative