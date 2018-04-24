const debug = require('debug')('charityhonor:server:lib:drives');
const reddit = require('./reddit')
const async = require('async')
const donise = require('./donise')
const {
  Drive,
  Donation
} = require('../models')

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

function fetchByClaim (claim, done) {
  console.log('WARNING: this is just grabbing the first drive');
  donise(Drive.findById(1), done)
}

function updateStats (id, done) {
  console.log('update stats');
  async.waterfall([
  //Query all all the relevant stats of the donations
  (next) => {
    console.log('lets find stuff');
    donise(Donation.sum('charge_amount', {where: {drive_id: id}}), (err, sum) => {
      if (err) {
        next(err)
        return
      }
      const stats = {
        sum: isNaN(sum) ? 0 : sum
      }

      next(null, stats)
    })
  },
  //Get the count
  (stats, next) => {
    donise(Donation.count('id', {where: {drive_id: id}}), (err, count) => {
      if (err) {
        next(err)
        return
      }
      stats.count = count

      next(null, stats)
    })
  },
  //Save them to the drive
  (stats, next) =>  {
    console.log('stats', stats);
    donise(Drive.update({
        num_donations: stats.count,
        total_amount: stats.sum
      },{
        where: {
          id: id
        },
      }), next)
  }],
  //Return the new drive with its saved stats
  (err, stats) => {
    console.log('all done!');
    if (err) {
      done(err)
      return
    }
    fetchById(id, done)
  })
}

/**
 * Returns the basic info needed to display a Drive
 * including drive info and most recent donations
 *
 * @param {Number} id Drive ID
 * @param {Function} done
 */
function fetchBreakdown (id, done) {
  async.waterfall([
  //Get the drive
  (next) => {
    fetchById(id, next)
  },
  //Get most recent donations
  (drive, next) => {
    const breakdown = {
      drive
    }
    donise(Donation.findAll({
      where: {
        drive_id: drive.id
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    }), (err, result) => {
      if (err) {
        console.log('err', err);
        next(err)
        return
      }
      breakdown.recentDonations = result
      next(null, breakdown)
    })
  },
  //TODO: Maybe get top donations here too
  (breakdown, next) => {
    console.log('try');
    next(null, breakdown)
  }], done)
}

module.exports = {
  validateDrive,
  create,
  fetchRecents,
  fetchById,
  fetchByClaim,
  updateStats,
  fetchBreakdown
}
