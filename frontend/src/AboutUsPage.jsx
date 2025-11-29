import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const content = {
    en: {
        title: "About Us",
        subtitle: "A Journey to Mobility",
        description: `
            <p>Aravinth E is a dedicated physiotherapist, nutritionist, and YouTube creator who specializes in helping people over the age of 50 with arthritis and mobility issues.</p>
            <p>After discovering a passion for helping people regain mobility and independence, Aravinth started his own physiotherapy center, Physio Pride, in 2020. Quickly building a fantastic reputation in the local area, Aravinth decided to share the same expert guidance he provided to his in-person clients with the wider community. This led to the creation of his YouTube channel, which has since amassed more than 1 lakh (100,000) subscribers worldwide, with his videos gaining millions of views every month.</p>
            <p>In 2024, seeing the immense need, he started live online exercise sessions for clients across India and globally, deciding to take his outreach to the next level.</p>
            <p>The following year, in 2025, Aravinth opened his second branch of Physio Pride. He also began working on a prerecorded online exercise program called "One Last Move," specifically designed for elders and individuals who suffer from knee arthritis and back pain in their daily lives.</p>
            <p>Today, Aravinth focuses his time on building and training his highly-skilled, specialist team at Physio Pride. Together, they help countless elders and arthritic people all over the world through online programs, while Aravinth continues creating content for his YouTube channel and treating patients in his centers.</p>
        `,
        teamTitle: "Meet the Team",
        teamDescription: "Our team consists of experienced physiotherapists and movement experts committed to your recovery."
    },
    ta: {
        title: "எங்களைப் பற்றி",
        subtitle: "இயக்கம் நோக்கிய ஒரு பயணம்",
        description: `
            <p>அரவிந்த் அவர்கள் ஒரு அர்ப்பணிப்புள்ள பிசியோதெரபிஸ்ட், ஊட்டச்சத்து நிபுணர், மற்றும் யூடியூப் படைப்பாளி ஆவார். இவர் 50 வயதிற்கு மேற்பட்டவர்கள், மூட்டுவலி மற்றும் இயக்கம் தொடர்பான பிரச்சனைகளால் பாதிக்கப்பட்டவர்களுக்கு உதவுவதில் நிபுணத்துவம் பெற்றவர்.</p>
            <p>மக்களின் இயக்கத்தை மீட்டெடுப்பதிலும், அவர்கள் சுதந்திரமாகச் செயல்பட உதவுவதிலும் தனக்கிருந்த ஆர்வத்தைக் கண்டறிந்த பிறகு, அரவிந்த் அவர்கள் 2020 ஆம் ஆண்டில், பிசியோ ப்ரைடு என்ற தனது சொந்த பிசியோதெரபி மையத்தைத் தொடங்கினார். குறுகிய காலத்திலேயே உள்ளூர் அளவில் ஒரு சிறப்பான நற்பெயரைக் கட்டியெழுப்பிய அரவிந்த், தான் நேரடியாகச் சந்திக்கும் நோயாளிகளுக்கு வழங்கும் அதே சிறப்பு வாய்ந்த ஆலோசனைகளை பரந்த சமூகத்துடனும் பகிர்ந்து கொள்ள முடிவு செய்தார். இதன் விளைவாகவே அவரது யூடியூப் சேனல் உருவாக்கப்பட்டது. இந்த சேனல் உலகளவில் ஒரு லட்சம் (100,000) சந்தாதாரர்களுக்கு மேல் பெற்றுள்ளதுடன், அவரது வீடியோக்கள் ஒவ்வொரு மாதமும் பல மில்லியன் பார்வைகளைப் பெறுகின்றன.</p>
            <p>2024 ஆம் ஆண்டில், இத்தகைய தேவையின் தீவிரத்தை உணர்ந்த அவர், இந்தியா மற்றும் உலகெங்கிலும் உள்ள நோயாளிகளுக்காக நேரடி ஆன்லைன் உடற்பயிற்சிக் கூட்டங்களைத் (live online exercise sessions) தொடங்கினார். இது அவரது சேவையை அடுத்த கட்டத்திற்கு எடுத்துச் செல்லும் முடிவாக இருந்தது.</p>
            <p>அடுத்த ஆண்டு, 2025 இல், அரவிந்த் அவர்கள் பிசியோ ப்ரைடு மையத்தின் இரண்டாவது கிளையைத் திறந்தார். மேலும், முதியவர்கள் மற்றும் அன்றாட வாழ்வில் மூட்டுவலி (knee arthritis), முதுகு வலியால் (back pain) பாதிக்கப்படுபவர்களுக்காகவே சிறப்பாக வடிவமைக்கப்பட்ட "ஒரு கடைசி நகர்வு" என்ற பெயரில், முன் பதிவு செய்யப்பட்ட இணையவழி உடற்பயிற்சி திட்டத்திலும் அவர் பணியாற்றத் தொடங்கினார்.</p>
            <p>இன்று, அரவிந்த் அவர்கள் பிசியோ ப்ரைடு மையத்தில் தனது உயர் திறமை வாய்ந்த, சிறப்பு நிபுணர் குழுவை உருவாக்குவதிலும், பயிற்சி அளிப்பதிலும் தனது நேரத்தைச் செலுத்துகிறார். இக்குழுவினர், ஆன்லைன் திட்டங்கள் மூலம் உலகெங்கிலும் உள்ள எண்ணற்ற முதியோர்களுக்கும், மூட்டுவலியால் பாதிக்கப்பட்டவர்களுக்கும் உதவுகின்றனர். அத்துடன், அரவிந்த் அவர்கள் தொடர்ந்து தனது யூடியூப் சேனலுக்கான உள்ளடக்கத்தை உருவாக்கி வருவதுடன், தனது மையங்களில் நோயாளிகளுக்கும் சிகிச்சை அளித்து வருகிறார்.</p>
        `,
        teamTitle: "குழுவை சந்திக்கவும்",
        teamDescription: "எங்கள் குழுவில் உங்கள் மீட்புக்கு அர்ப்பணிப்புள்ள அனுபவம் வாய்ந்த பிசியோதெரபிஸ்டுகள் மற்றும் இயக்க நிபுணர்கள் உள்ளனர்."
    }
};

const AboutUsPage = ({ language }) => {
    const t = content[language];

    return (
        <Container className="py-5">
            <Row className="mb-5">
                <Col lg={8} className="mx-auto text-center">
                    <h1 className="main-heading mb-3">{t.title}</h1>
                    <h3 className="sub-heading text-muted">{t.subtitle}</h3>
                </Col>
            </Row>
            <Row>
                <Col lg={10} className="mx-auto">
                    <div dangerouslySetInnerHTML={{ __html: t.description }} />
                </Col>
            </Row>
            <Row className="mt-5">
                <Col lg={12} className="text-center">
                    <h2 className="main-heading mb-4">{t.teamTitle}</h2>
                    <p className="lead">{t.teamDescription}</p>
                    {/* Add team member photos or details here if needed */}
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUsPage;
