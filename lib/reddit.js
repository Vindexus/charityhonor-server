const snoowrap = require('snoowrap');
const config = require('./config')

// NOTE: The following examples illustrate how to use snoowrap. However, hardcoding
// credentials directly into your source code is generally a bad idea in practice (especially
// if you're also making your source code public). Instead, it's better to either (a) use a separate
// config file that isn't committed into version control, or (b) use environment variables.

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
const r = new snoowrap(config.reddit);

//https://www.reddit.com/r/AskReddit/comments/8dunbb/how_would_you_feel_about_a_law_legalizing_and/dxqnr09/
//https://www.reddit.com/r/AskReddit/comments/8dunbb/how_would_you_feel_about_a_law_legalizing_and
function urlToPost (url) {
  if (url.indexOf('http') != 0) {
    return [new Error('Must start with http')]
  }


  let simpleUrl = url.replace(/https?:\/\//, '').replace(/\w+\.reddit\.com/, '')

  if (simpleUrl.indexOf('?') > 0) {
    simpleUrl = simpleUrl.substr(0, simpleUrl.indexOf('?'))
  }

  let parts = simpleUrl.split('/')

  parts = parts.filter(x => x.length)

  //Post
  if (parts.length == 5) {
    let id = parts[3]
    return [null, {
      type: 'submission',
      id: id
    }]
  }
  else if(parts.length == 6) {
    let id = parts[5]
    return [null, {
      type: 'comment',
      id: id
    }]
  }

  return [new Error('Error getting type from URL')]
}

function getPost (url, done) {
  let [err, post] = urlToPost(url)

  if (err) {
    done(err)
    return
  }


  if (post.type == 'comment') {
    r.getComment(post.id).fetch().then((comment) => {
      done(null, {
        type: 'comment',
        data: comment.toJSON()
      })
    }).catch((err) => {
      console.log('caught an error', err);
      done(err)
    })
  }
  else {
    r.getSubmission(post.id).fetch().then((submission) => {
      done(null, {
        type: 'submission',
        data: submission.toJSON()
      })
    }).catch((err) => {
      done(err)
    })
  }
}

module.exports = {
  snoowrap: r,
  getPost
}