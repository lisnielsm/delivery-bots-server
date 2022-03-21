class BotDto {

    constructor({ _id, status, location, zone_id }) {
        this.id = _id;
        this.status = status;
        this.location = location;
        this.zone_id = zone_id;
    }
}

module.exports = BotDto;