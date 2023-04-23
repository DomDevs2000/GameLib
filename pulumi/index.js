const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const fs = require('fs');

const ubuntu = aws.ec2.getAmi({
    mostRecent: true,
    filters: [
        {
            name: "name",
            values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["099720109477"],
});
const web = new aws.ec2.Instance("web", {
    ami: ubuntu.then(ubuntu => ubuntu.id),
    instanceType: "t2.micro",
    tags: {
        Name: "GameLib",
    },
});
const mainvpc = new aws.ec2.Vpc("mainvpc", {cidrBlock: "10.1.0.0/16"});
const _default = new aws.ec2.DefaultSecurityGroup("default", {
    vpcId: mainvpc.id,
    ingress: [{
        protocol: "-1",
        self: true,
        fromPort: 0,
        toPort: 0,
    }],
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
    }],
});
