const commands =
{
    name: "love",
    description: "Join love list message",
    default_member_permissions: 0,
    options: [
        {
            "name": "hours",
            "description": "Quelle heure ?",
            "type": 4,
            "required": true
        },
        {
            "name": "minutes",
            "description": "Une minute précise ?",
            "type": 4,
            "required": true
        },
        {
            "name": "message",
            "description": "Un message particulier ?",
            "type": 3,
            "required": false
        }
    ]
};

module.exports = {
    data: commands
}