import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { NavLink } from "react-router-dom";

import AlertMessage from "../../alert/alert.component";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { GET_FLOW_DATA_BY_STATUS } from "../../../graphql/queries/flow-data.query";
import { RequisitionDetailsContext } from "./requisition-details.component";
import { mercureUrl, parseIRI, parseUuidIRI } from "../../../utils/response.util";
import { flowComponentMapping } from "./flow-attributes/flow-components";
import { requisitionStatusConst } from "../../../utils/consts.util";

const RequistionDetailsInvoiceContext = createContext();
const RequistionDetailsInvoiceContentContext = createContext();

const RequistionDetailsInvoiceTab = ({ invoices, tag }) => {
  const client = useApolloClient();
  const { userRole } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  if (!invoices.length) return <></>;

  const __findInvoice = (invoices, direction) => {
    return invoices.find((invoice) => invoice.direction === direction);
  };

  let paymentInvoice = __findInvoice(invoices, "payment");
  let payoutInvoice = __findInvoice(invoices, "payout");

  return (
    <RequistionDetailsInvoiceContext.Provider value={{ tag, userRole }}>
      <RequistionDetailsInvoiceContentContext.Provider
        value={{ invoice: paymentInvoice }}
      >
        <RequisitionInvoiceContent />
      </RequistionDetailsInvoiceContentContext.Provider>
      <RequistionDetailsInvoiceContentContext.Provider
        value={{ invoice: payoutInvoice }}
      >
        <RequisitionInvoiceContent />
      </RequistionDetailsInvoiceContentContext.Provider>
    </RequistionDetailsInvoiceContext.Provider>
  );
};

const RequisitionInvoiceContent = () => {
  const { invoice } = useContext(RequistionDetailsInvoiceContentContext);

  if (!invoice) return <></>;
  return <RequisitionInvoiceFlowContent />;
};

const RequisitionInvoiceFlowContent =() => {
  const { userRole, tag } = useContext(RequistionDetailsInvoiceContext);
  const { invoice } = useContext(RequistionDetailsInvoiceContentContext);
  const { requisitionId, status, payment, payout } = useContext(RequisitionDetailsContext);

  const { data, loading, error, refetch } = useQuery(GET_FLOW_DATA_BY_STATUS, {
    variables: {
      status: invoice.status,
      invoice_requisition_id: parseUuidIRI(requisitionId),
      invoice_id: parseUuidIRI(invoice.id),
    },
    fetchPolicy: "network-only",
  });

  mercureUrl.searchParams.append("topic", `http://buycoin/callback/${parseUuidIRI(requisitionId)}`);

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = (event) => {
      refetch({
        variables: {
          status: JSON.parse(event.data).status,
          invoice_requisition_id: parseUuidIRI(requisitionId),
          invoice_id: parseUuidIRI(invoice.id),
        },
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) return "loading...";
  if (error) return "Error";
  if (!data) return "Not found";

  const { flowDatas } = data;

  if (status === requisitionStatusConst.CARD_VERIFICATION)
    return (
        <>
          <br/>
          <AlertMessage message="Need card verification. " />
        </>
    )

  if (!flowDatas.length) return <></>;

  return (
    flowDatas &&
    flowDatas.map(({ id, name, value }) => {
      const Component = flowComponentMapping[name];
      if (!Component) return <span key={id}></span>;
      return (
        <Component
          key={id}
          value={value}
          requisitionStatus={status}
          tag={tag}
          userRole={userRole}
        />
      );
    })
  );
};

export default React.memo(RequistionDetailsInvoiceTab);
