import "@stdlib/deploy";

message Confirm {
    detail: String;
}

contract C2 with Deployable {
   
    
    status : Bool ;
    c3Address : Address;
    c1Address : Address;

    init(c3: Address,c1: Address) {
        self.status = false;
        self.c3Address = c3;
        self.c1Address = c1;
    }

  
    receive("sending request for confirmation by C1 to C2") {
      
        if(self.status){
            send(SendParameters{
                to: self.c1Address,
                value: 0,
                mode: SendRemainingValue,
                body: "request confirmed by C2 to C1".asComment()
            });
        }
        else {
            dump("C2: C3 has not confirmed yet, waiting for confirmation from C3");
            dump("C2: Sending request again for confirmation from C3");
            send(SendParameters{
            to: self.c3Address,
            value: 0,
            mode: SendRemainingValue,
            body: "sending request for confirmation by C2 to C3".asComment()
        });
        
        
       }
    }

    receive(msg: Confirm) {
        if (msg.detail == "request confirmed by C3 to C2") {
            dump("C2: Received confirmation from C3, proceeding....");
            self.status=true;
        } else {
             dump("C2: Waiting for proper confirmation from C3 ...");
        }
    }
   
}


