import "@stdlib/deploy";

message Confirm {
    detail: String;
}

contract C3 with Deployable{

    status : Bool ;
    c1Address : Address;
    c2Address : Address;

    init(c1: Address,c2: Address) {
        self.status = false;
        self.c1Address = c1;
        self.c2Address = c2;
    }
    receive("sending request for confirmation by C2 to C3") {
      
        if(self.status){
            send(SendParameters{
                to: self.c2Address,
                value: 0,
                mode: SendRemainingValue,
                body: "request confirmed by C3 to C2".asComment()
            });
        }
        else {
            dump("C3: C1 has not confirmed yet, waiting for confirmation from C1");
            dump("C3: Sending request again for confirmation from C1");
            send(SendParameters{
            to: self.c1Address,
            value: 0,
            mode: SendRemainingValue,
            body: "sending request for confirmation by C3 to C1".asComment()
        });
        
        
       }
    }

    receive(msg: Confirm) {
        if (msg.detail == "request confirmed by C1 to C3") {
            dump("C3: Received confirmation from C1, proceeding....");
            self.status=true;
        } else {
             dump("C3: Waiting for proper confirmation from C1 ...");
        }
    }





}