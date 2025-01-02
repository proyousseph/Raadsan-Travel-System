import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Button, Form } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./modal.module.scss";
import Select from "react-select";
import { countries } from "../../data/countryData";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { registerTicket } from "../../api/other";

const customStyles = {
  content: {
    top: "50%",
    left: "60%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// setting up the main element
ReactModal.setAppElement("#root");
function Modal({
  showToastMessage,
  isOpen,
  setisOpen,
  bankaccountinformation,
  locationinformation,
  flightinformation,
  getAlldata,
  currentTicket,
  setCurrentTicket,
}) {
  function closeModal() {
    setisOpen(!isOpen);
    setTicketInfo([]);
    setDepatureVal(null);
    setAirlineVal([]);
    setArrivalVal(null);
    setPassportNat(null);
    setArrival([]);
    setDepature([]);
    setAirline([]);
    setCurrentTicket([]);
    setIsLocal(false);
  }
  const [ticketInfo, setTicketInfo] = useState([]);
  const [depature, setDepature] = useState([]);
  const [depatureVal, setDepatureVal] = useState("");
  const [arrival, setArrival] = useState([]);
  const [arrivalVal, setArrivalVal] = useState([]);
  const [airline, setAirline] = useState([]);
  const [airlineVal, setAirlineVal] = useState([]);
  const [passportNat, setPassportNat] = useState([]);
  const [isLocal, setIsLocal] = useState(false);
  const [ticketType, setTtype] = useState("form-group col-md-3");

  const currentDate = new Date().toISOString().slice(0, 16);
  useEffect(() => {
    setTicketInfo({
      ...ticketInfo,
      title_type: currentTicket.customer_title,
      first_name: currentTicket.customer_name.split(",")[0],
      last_name: currentTicket.customer_name.split(",")[1],
      sex: currentTicket.customer_sex,
      customer_mobile: currentTicket.customer_phone,
      travel_type: currentTicket.travel_type,
      ticket_type: currentTicket.ticket_type.split(",")[0],
    });

    if (currentTicket.ticket_type.split(",")[0] === "One way") {
      // setTicketInfo({ ...ticketInfo, return_date: "202" });
      setTtype("form-group col-md-4");
    } else {
      setTtype("form-group col-md-3");
    }

    if (currentTicket.travel_type === "Local") {
      // filter flight
      var filter_flight = [];
      for (var i = 0; i < flightinformation.length; i++) {
        if (flightinformation[i].travel_type !== "International") {
          filter_flight.push({
            value: flightinformation[i].flight_id,
            label:
              flightinformation[i].flight_code +
              " | " +
              flightinformation[i].flight_name,
          });
        }
      }

      // filter location
      var filter_location = [];
      for (var i = 0; i < locationinformation.length; i++) {
        if (locationinformation[i].travel_type !== "International") {
          filter_location.push({
            value: locationinformation[i].location_id,
            label:
              locationinformation[i].location_code +
              " | " +
              locationinformation[i].location_name,
          });
        }
      }
      setAirline(filter_flight);
      setDepature(filter_location);
      setArrival(filter_location);
      setIsLocal(true);
    } else if (currentTicket.travel_type === "International") {
      // filter flight
      var filter_flight = [];
      for (var i = 0; i < flightinformation.length; i++) {
        if (flightinformation[i].travel_type !== "Local") {
          filter_flight.push({
            value: flightinformation[i].flight_id,
            label:
              flightinformation[i].flight_code +
              " | " +
              flightinformation[i].flight_name,
          });
        }
      }

      // filter location
      filter_location = [];
      for (var i = 0; i < locationinformation.length; i++) {
        if (locationinformation[i].travel_type !== "Local") {
          filter_location.push({
            value: locationinformation[i].location_id,
            label:
              locationinformation[i].location_code +
              " | " +
              locationinformation[i].location_name,
          });
        }
      }
      setAirline(filter_flight);
      setDepature(filter_location);
      setArrival(filter_location);
      setIsLocal(false);
    }
  }, []);

  if (currentTicket.length === 0) return;
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setTicketInfo({ ...ticketInfo, [name]: value });
    if (name === "ticket_type") {
      if (value === "One way") {
        // setTicketInfo({ ...ticketInfo, return_date: "202" });
        setTtype("form-group col-md-4");
      } else {
        setTtype("form-group col-md-3");
      }
    }
    if (name === "travel_type") {
      setAirlineVal(null);
      setDepatureVal(null);
      setArrivalVal(null);
      setPassportNat(null);
      setAirline([]);
      setArrival([]);
      setDepature([]);
      if (value === "Local") {
        // filter flight
        var filter_flight = [];
        for (var i = 0; i < flightinformation.length; i++) {
          if (flightinformation[i].travel_type !== "International") {
            filter_flight.push({
              value: flightinformation[i].flight_id,
              label:
                flightinformation[i].flight_code +
                " | " +
                flightinformation[i].flight_name,
            });
          }
        }

        // filter location
        var filter_location = [];
        for (var i = 0; i < locationinformation.length; i++) {
          if (locationinformation[i].travel_type !== "International") {
            filter_location.push({
              value: locationinformation[i].location_id,
              label:
                locationinformation[i].location_code +
                " | " +
                locationinformation[i].location_name,
            });
          }
        }
        setAirline(filter_flight);
        setDepature(filter_location);
        setArrival(filter_location);
        setIsLocal(true);
      } else if (value === "International") {
        // filter flight
        var filter_flight = [];
        for (var i = 0; i < flightinformation.length; i++) {
          if (flightinformation[i].travel_type !== "Local") {
            filter_flight.push({
              value: flightinformation[i].flight_id,
              label:
                flightinformation[i].flight_code +
                " | " +
                flightinformation[i].flight_name,
            });
          }
        }

        // filter location
        filter_location = [];
        for (var i = 0; i < locationinformation.length; i++) {
          if (locationinformation[i].travel_type !== "Local") {
            filter_location.push({
              value: locationinformation[i].location_id,
              label:
                locationinformation[i].location_code +
                " | " +
                locationinformation[i].location_name,
            });
          }
        }
        setAirline(filter_flight);
        setDepature(filter_location);
        setArrival(filter_location);
        setIsLocal(true);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (depatureVal.value === arrivalVal.value) {
      showToastMessage(
        "error",
        "Depature place and Arrival place can not be same."
      );
      return;
    }

    var post = new FormData();
    if (ticketInfo.ticket_type === "Round way") {
      post.append("ReturnDate", ticketInfo.return_date);
      if (ticketInfo.return_date <= ticketInfo.depature_date) {
        showToastMessage(
          "error",
          "Arrival date can not be equal or less than Depature date."
        );
        return;
      }
    } else {
      post.append("ReturnDate", "-");
    }
    post.append("action", "registerTicket");
    post.append("TicketID", currentTicket.ticket_id);
    post.append("CustomerTitle", ticketInfo.title_type);
    post.append("CustomerFName", ticketInfo.first_name);
    post.append("CustomerLName", ticketInfo.last_name);
    post.append("CustomerPhone", ticketInfo.customer_mobile);
    post.append("TicketType", currentTicket.ticket_type);
    post.append("SexType", ticketInfo.sex);
    post.append("TravelType", ticketInfo.travel_type);
    post.append("Depature", depatureVal.value);
    post.append("DepatureDate", ticketInfo.depature_date);
    post.append("Arrival", arrivalVal.value);
    post.append("AirlineID", airlineVal.value);
    post.append("GrossAmount", ticketInfo.gross_amount);
    post.append("NetAmount", ticketInfo.net_amount);
    post.append("BankID", ticketInfo.bank_accounts);
    post.append("TicketStatus", ticketInfo.ticket_status);
    post.append("update", "1");

    post.append("PassportNumber", "-");
    post.append("BirthDate", "-");
    post.append("PassportNationality", "-");
    post.append("ExpireDate", "-");
    // if (ticketInfo.travel_type === "Local") {
    // } else {
    //   post.append("PassportNumber", ticketInfo.passport_number);
    //   post.append("BirthDate", ticketInfo.birth_date);
    //   post.append("PassportNationality", passportNat.value);
    //   post.append("ExpireDate", ticketInfo.expire_date);
    // }
    var ticketInf = await registerTicket(post);
    // console.log(ticketInf);
    // return;
    if (ticketInf.status) {
      getAlldata();
      closeModal();
      showToastMessage("success", ticketInf.Message);
    } else {
      showToastMessage("error", ticketInf.Message);
    }
  };
  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2
          style={{
            textAlign: "center",
            margin: "3%",
            fontWeight: "bold",
            marginBottom: "2%",
          }}
        >
          UPDATE TICKET INFORMATION
        </h2>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="form-group col-md-2">
              <label>Title</label>
              <select
                onChange={handleOnChange}
                className="form-select"
                name="title_type"
                value={ticketInfo.title_type}
                id="title_type"
                required
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Mrs">Miss</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            <div className="form-group col-md-3">
              <label>First Name</label>
              <Form.Control
                type="text"
                className="form-control"
                value={ticketInfo.first_name}
                placeholder="First Name"
                name="first_name"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-3">
              <label>Last Name</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="last_name"
                value={ticketInfo.last_name}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Customer Mobile</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Mobile"
                value={ticketInfo.customer_mobile}
                name="customer_mobile"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-4">
              <label>Ticket Type</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Passport Number"
                id="ticket_type"
                name="ticket_type"
                value={ticketInfo.ticket_type}
                onChange={handleOnChange}
                readOnly
                disabled
              />
            </div>
            <div className="form-group col-md-4">
              <label>Select Sex</label>
              <select
                onChange={handleOnChange}
                className="form-select"
                name="sex"
                id="sex"
                value={ticketInfo.sex}
                required
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group col-md-4">
              <label>Select Travel Type</label>
              <select
                onChange={handleOnChange}
                className="form-select"
                name="travel_type"
                id="travel_type"
                value={ticketInfo.travel_type}
                required
              >
                <option value="">Type</option>
                <option value="Local">Local</option>
                <option value="International">International</option>
              </select>
            </div>
          </div>
          {isLocal === true ? (
            ""
          ) : (
            ""
            // <div className="row mb-3">
            //   <div className="form-group col-md-3">
            //     <label>Passport Number</label>
            //     <Form.Control
            //       type="text"
            //       className="form-control"
            //       placeholder="Passport Number"
            //       id="passport_number"
            //       name="passport_number"
            //       onChange={handleOnChange}
            //       required
            //     />
            //   </div>
            //   <div className="form-group col-md-3">
            //     <label>Birth Date</label>
            //     <Form.Control
            //       type="date"
            //       className="form-control"
            //       placeholder="Birth Date"
            //       name="birth_date"
            //       id="birth_date"
            //       onChange={handleOnChange}
            //       required
            //     />
            //   </div>
            //   <div className="form-group col-md-3">
            //     <label>Passport Nationality</label>
            //     <Select
            //       value={passportNat}
            //       styles={{
            //         menu: (baseStyles, state) => ({
            //           ...baseStyles,
            //           color: "black",
            //         }),
            //       }}
            //       options={countries}
            //       name="passport_nationality"
            //       id="passport_nationality"
            //       onChange={setPassportNat}
            //       required
            //     />
            //   </div>
            //   <div className="form-group col-md-3">
            //     <label>Expire Date</label>
            //     <Form.Control
            //       type="date"
            //       className="form-control"
            //       placeholder="Expire Date"
            //       name="expire_date"
            //       id="expire_date"
            //       onChange={handleOnChange}
            //       required
            //     />
            //   </div>
            // </div>
          )}
          <div className="row mb-3">
            <div className={ticketType}>
              <label>Depature Place</label>
              <Select
                value={depatureVal}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="depature_place"
                id="depature_place"
                options={depature}
                onChange={setDepatureVal}
                required
              />
            </div>
            <div className={ticketType}>
              <label>Depature Date</label>
              <Form.Control
                min={currentDate}
                type="datetime-local"
                className="form-control"
                placeholder="Depature Date"
                name="depature_date"
                id="depature_date"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className={ticketType}>
              <label>Arrival Place</label>
              <Select
                value={arrivalVal}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="arrival_place"
                id="arrival_place"
                options={arrival}
                onChange={setArrivalVal}
                required
              />
            </div>
            {ticketType === "form-group col-md-3" ? (
              <div className={ticketType}>
                <label>Return Date</label>
                <Form.Control
                  type="datetime-local"
                  min={currentDate}
                  className="form-control"
                  placeholder="Return Date"
                  name="return_date"
                  id="return_date"
                  onChange={handleOnChange}
                  required
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-3">
              <label>Select Airline</label>
              <Select
                value={airlineVal}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="airline_id"
                id="airline_id"
                options={airline}
                onChange={setAirlineVal}
                required
              />
            </div>
            <div className="form-group col-md-2">
              <label>Gross Amount</label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                className="form-control"
                placeholder="Gross Amount"
                name="gross_amount"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-2">
              <label>Net Amount</label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                className="form-control"
                placeholder="Net Amount"
                name="net_amount"
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="form-group col-md-3">
              <label>Bank Accounts</label>
              <select
                className="form-select"
                name="bank_accounts"
                id="bank_accounts"
                onChange={handleOnChange}
                required
              >
                <option value="">Select Account</option>
                {bankaccountinformation.map((account, index) => (
                  <option key={index} value={account.bank_id}>
                    {account.bank_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2">
              <label>Select Status</label>
              <select
                onChange={handleOnChange}
                className="form-select"
                name="ticket_status"
                id="ticket_status"
                required
              >
                <option value="">Ticket Status</option>
                <option value="Booking">Booking</option>
                <option value="Confirm">Confirm</option>
              </select>
            </div>
          </div>
          <div
            className="form-group col-md-6 mt-4"
            style={{ marginLeft: "35%" }}
          >
            <Button type="submit" className="btn btn-primary">
              <MdOutlineAirplaneTicket sx={{ mr: "10px" }} />
              Update
            </Button>

            <Button
              type="button"
              className="btn btn-danger"
              onClick={closeModal}
              style={{ marginLeft: "20%" }}
            >
              <AiFillCloseCircle /> Close
            </Button>
          </div>
        </Form>
      </ReactModal>
    </div>
  );
}

export default Modal;
