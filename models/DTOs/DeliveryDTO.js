
class DeliveryDto {

    constructor({_id, creation_date, state, pickup, dropoff, zone_id}) {
        this.id = _id;        
        this.creation_date = creation_date;
        this.state = state;
        this.pickup = pickup;
        this.dropoff = dropoff;
        this.zone_id = zone_id;
    }
}

module.exports = DeliveryDto;