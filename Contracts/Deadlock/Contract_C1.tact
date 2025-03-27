import "@stdlib/deploy";

message Confirm {
    detail: String;
}

contract C1 with Deployable {
   
    
    status : Bool ;
    c2Address : Address;
    c3Address : Address;

    init(c2: Address,c3: Address) {
        self.status = false;
        self.c2Address = c2;
        self.c3Address = c3;
    }

  
    receive("start") {
     
        send(SendParameters{
            to: self.c2Address,
            value: 0,
            mode: SendRemainingValue,
            body: "sending request for confirmation by C1 to C2".asComment()
        });
        
    }

    receive(msg: Confirm) {
        if (msg.detail == "request confirmed by C2 to C1") {
            dump("C1: Received confirmation from C2, proceeding....");
            self.status=true;
        } else {
             dump("C1: Waiting for proper confirmation from C2 ...");
        }
    }
    receive("sending request for confirmation by C3 to C1"){
        if(self.status){
            send(SendParameters{
                to: self.c3Address,
                value: 0,
                mode: SendRemainingValue,
                body: "request confirmed by C1 to C3".asComment()
            });
        }
        else {
            dump("C1: C2 has not confirmed yet, waiting for confirmation from C2");
            dump("C1: Sending request again for confirmation from C2");
            send(SendParameters{
            to: self.c2Address,
            value: 0,
            mode: SendRemainingValue,
            body: "sending request for confirmation by C1 to C2".asComment()
        });

        }
    }
}