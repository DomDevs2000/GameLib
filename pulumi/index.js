const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");


const ami = aws.ec2.getAmi({
    mostRecent: true,
    filters: [
        {
            name: "name",
            values: ["al2023-ami-2023.0.20230419.0-kernel-6.1-x86_64"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["137112412989"],
});

const server = new aws.ec2.Instance("GameLibTest", {
    ami: ami.then(ami => ami.id),
    instanceType: "t3.micro",
    tags: {
        Name: "GameLib-Test",
    },
});


module.exports.publicIp = server.publicIp;
module.exports.publicHostName = server.publicDns;


