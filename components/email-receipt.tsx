import {
  Html, Body, Container, Text, Section, Heading, Hr, Row, Column
} from '@react-email/components';

export const ReceiptEmail = ({ order }: { order: any }) => (
  <Html>
    <Body style={{ backgroundColor: '#f9fafb', padding: '20px' }}>
      <Container style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <Heading style={{ color: '#dc2626', fontStyle: 'italic' }}>MSC APPLIANCES</Heading>
        <Text>Thank you for your purchase, {order.firstName}!</Text>
        <Section>
          <Text style={{ fontSize: '12px', color: '#6b7280' }}>Order #: {order.id.replace('sale_', '')}</Text>
        </Section>
        <Hr />
        <Section>
          {order.items.map((item: any, i: number) => (
            <Row key={i} style={{ paddingBottom: '10px' }}>
              <Column><Text><strong>{item.name}</strong></Text></Column>
              <Column align="right"><Text>${(item.price / 100).toFixed(2)}</Text></Column>
            </Row>
          ))}
        </Section>
        <Hr />
        <Section align="right">
          <Text>Tax: ${order.taxAmount}</Text>
          <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>Total Paid: ${order.amount}</Text>
        </Section>
        <Text style={{ fontSize: '12px', color: '#6b7280', marginTop: '20px' }}>
          Location: 5815 Lomas Blvd NE, Albuquerque, NM 87110
        </Text>
      </Container>
    </Body>
  </Html>
);