"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const fs = require('fs');

// Logger bucket
const logBucket = new aws.s3.Bucket("logBucket", {acl: "log-delivery-write"});


// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("DomDevs-GameLib", {
    acl: "public-read",
    policy: fs.readFileSync("policy.json"),
    website: {
        indexDocument: "index.html",
        errorDocument: "index.html",
        routingRules: `[{
    "Condition": {
        "KeyPrefixEquals": "docs/"
    },
    "Redirect": {
        "ReplaceKeyPrefixWith": "documents/"
    }
}]
`,
    },
    versioning: {
        enabled: true,
    },
    loggings: [{
        targetBucket: logBucket.id,
        targetPrefix: "log/",
    }],


});

// metric bucket
const example_entire_bucket = new aws.s3.BucketMetric("metric-entire-bucket", {bucket: bucket.id});

// Export the name of the bucket
exports.bucketName = bucket.id;