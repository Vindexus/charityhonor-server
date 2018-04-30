const debug = require('debug')('charityhonor:server:lib:drives');
const crypto = require('crypto')
const reddit = require('./reddit')
const async = require('async')
const donise = require('./donise')
const charityLib = require('./charities')

const {
  Drive,
  Donation,
  Charity
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
  validateDrive(body, (err) => {
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

      const hashSource = new Date().getTime() + '_' + post.data.id + '_' + Math.random()
      const drive = {
        reddit_type: post.type,
        reddit_author: post.data.author,
        reddit_permalink: post.data.permalink,
        reddit_subreddit: post.data.subreddit,
        reddit_id: post.data.id,
        charity_claim_token: crypto.createHash('md5').update(hashSource).digest('hex')
      }

      if (post.type == 'comment') {
        drive.reddit_content = post.data.body
      }
      else {
        drive.reddit_title = post.data.title
        drive.reddit_content = post.data.selftext
      }

      findByReddit(drive.reddit_type, drive.reddit_id, (err, duplicate) => {
        if (err) {
          done(err)
          return
        }

        if (duplicate) {
          done(null, {
            status: 'duplicate',
            drive: duplicate
          })
          return
        }

        donise(Drive.create(drive), (err, drive) => {
          if (err) {
            done(err)
            return
          }

          done(null, {
            status: 'created',
            drive
          })
        })
      })
    })
  })
}

function findByReddit (type, id, done) {
  donise(Drive.findOne({
    where: {
      reddit_type: type,
      reddit_id: id
    }
  }), done)
}

function findLatest (done) {
  donise(Drive.findAndCountAll({
    limit: 10,
    order: [['createdAt', 'DESC']]
  }), done)
}

function findTop (done) {
  donise(Drive.findAndCountAll({
    limit: 10,
    order: [['total_amount', 'DESC']]
  }), done)
}

function findById (id, done) {
  donise(Drive.findById(id, {
    include:[{
      model: Charity,
      as: 'charity',
      required: false
    }]
  }), done)
}

function findByToken (token, done) {
  donise(Drive.findOne({
    where: {
      charity_claim_token: token
    }
  }), done)
}

function chooseCharity (token, charityId, done) {
  async.waterfall([
    (next) => {
      console.log('one');
      findByToken(token, (err, drive) => {
        if (err) {
          next(err)
          return
        }
        next(null, drive)
      })
    },
    (drive, next) => {
      console.log('two');
      charityLib.findById(charityId, (err, charity) => {
        console.log('err',err);
        console.log('charity',charity);
        if (err) {
          console.log('error getting charity');
          next(err)
          return
        }

        if (!charity) {
          console.log('NO CHARITY');
          next(new Error('Could not find charity with id ' + charityId))
          return
        }

        next(null, drive, charity)
      })
    },
    (drive, charity, next) => {
      //TODO: Save charity
      console.log('three');
      drive.charity_id = charity.id
      drive.save()
        .then(() => {
          next(null, drive, charity)
        })
        .catch((err) => {
          next(err)
        })
    },
    (drive, charity, next) => {
      console.log('four');
      //TODO: allocate the existing donations OR do that with a cron or some other job
      next(null, drive, charity)
    }], done)
}

function updateStats (id, done) {
  async.waterfall([
  //Query all all the relevant stats of the donations
  (next) => {
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
    donise(Donation.count({where: {drive_id: id}}), (err, count) => {
      console.log('count', count);
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
    if (err) {
      done(err)
      return
    }
    findById(id, done)
  })
}

/**
 * Returns the basic info needed to display a Drive
 * including drive info and most recent donations
 *
 * @param {Number} id Drive ID
 * @param {Function} done
 */
function findBreakdown (id, done) {
  async.waterfall([
  //Get the drive
  (next) => {
    findById(id, next)
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

/*
*/
function driveToReturnObject (drive) {
  const json = {...drive.dataValues}
  console.log('json.charity_claim_token',json.charity_claim_token);
  delete json.charity_claim_token
  return json
}

module.exports = {
  validateDrive,
  create,
  findLatest,
  findById,
  findByToken,
  findTop,
  updateStats,
  findBreakdown,
  driveToReturnObject,
  chooseCharity
}
