/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import App from 'app/src/App.vue'





function getMatchedComponents (to, router) {
  const route = to
    ? (to.matched ? to : router.resolve(to).route)
    : router.currentRoute

  if (!route) { return [] }
  return [].concat.apply([], route.matched.map(m => {
    return Object.keys(m.components).map(key => {
      return {
        path: m.path,
        c: m.components[key]
      }
    })
  }))
}

export function addPreFetchHooks (router, store) {
  // Add router hook for handling preFetch.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const
      matched = getMatchedComponents(to, router),
      prevMatched = getMatchedComponents(from, router)

    let diffed = false
    const components = matched
      .filter((m, i) => {
        return diffed || (diffed = (
          !prevMatched[i] ||
          prevMatched[i].c !== m.c ||
          m.path.indexOf('/:') > -1 // does it has params?
        ))
      })
      .filter(m => m.c && typeof m.c.preFetch === 'function')
      .map(m => m.c)

    

    if (!components.length) { return next() }

    let redirected = false
    const redirect = url => {
      redirected = true
      next(url)
    }
    const proceed = () => {
      
      if (!redirected) { next() }
    }

    
    Promise.all(
      components.map(c => {
        if (redirected) { return }
        return c.preFetch({
          store,
          currentRoute: to,
          previousRoute: from,
          redirect
        })
      })
    )
    .then(proceed)
    .catch(proceed)
  })
}
