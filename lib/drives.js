const debug = require('debug')('charityhonor:server:lib:drives');
const reddit = require('./reddit')
const async = require('async')
const donise = require('./donise')
const { Drive } = require('../models')

/**
 * Validates a drive
 */
function validateDrive (body, done) {
  async.waterfall([(next) => {
    if (!body.redditPostUrl) {
      next(new Error('Reddit post or comment URL is required'))
      return
    }
    next(null)
  }, (next) => {
    reddit.getPost(body.redditPostUrl, (err, data) => {
      if (err) {
        next(new Error('Error retrieving reddit post: ' + err.toString()))
        return
      }

      next(null)
    })
  }, (next) => {
    //TODO: Query database for a drive matching this post
    const alreadyExists = false
    if (alreadyExists) {
      return next(new Error('A drive already exists for that post'))
    }
    next(null)
  }], done)
}

function create (body, done) {
  debug('create drive')
  validateDrive(body, (err) => {
    console.log('validationg',err);
    if (err) {
      debug(err)
      done(err)
      return
    }

    reddit.getPost(body.redditPostUrl, (err, post) => {
      if (err) {
        done(err)
        return
      }

      const drive = {
        reddit_type: post.type,
        reddit_author: post.data.author,
        reddit_permalink: post.data.permalink,
        reddit_subreddit: post.data.subreddit,
        reddit_id: post.data.id
      }

      if (post.type == 'comment') {
        drive.reddit_content = post.data.body
      }
      else {
        drive.reddit_title = post.data.title
        drive.reddit_content = post.data.selftext
      }

      console.log('drive',drive);

      //return done(new Error('I cant let you do that'))

      donise(Drive.create(drive), done)
    })
  })
}

function fetchRecents (done) {
  donise(Drive.findAndCountAll({
    limit: 5
  }), done)
}

function fetchById (id, done) {
  donise(Drive.findById(id), done)
}

module.exports = {
  validateDrive,
  create,
  fetchRecents,
  fetchById
}
