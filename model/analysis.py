import sys
import json
from transformers import pipeline

# Use a more advanced pre-trained model for sentiment analysis
sentiment_analysis = pipeline(
    "sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english"
)


def analyze_sentiment(text):
    result = sentiment_analysis(text)
    return result


if __name__ == "__main__":
    text = sys.argv[1]
    sentiment = analyze_sentiment(text)
    print(json.dumps(sentiment))
