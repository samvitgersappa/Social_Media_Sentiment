import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import numpy as np


class SentimentAnalyzer:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        # Use a pre-trained sentiment model
        model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name).to(
            self.device
        )

    def analyze_sentiment(self, text):
        """
        Analyze sentiment of input text and return label and rating.

        Returns:
            dict: Contains 'label' (str) and 'rating' (float)
        """
        try:
            # Tokenize input
            inputs = self.tokenizer(
                text, return_tensors="pt", truncation=True, padding=True, max_length=128
            ).to(self.device)

            with torch.no_grad():
                outputs = self.model(**inputs)
                scores = outputs.logits[0].cpu().numpy()
                scores = softmax(scores)

                # This model returns scores from 1 to 5
                # Convert to our -5 to 5 scale
                rating = self._convert_to_rating_scale(scores)
                label = self._get_sentiment_label(rating)

                return [{"label": label.upper(), "score": round(rating / 5, 2)}]

        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            return None

    def _convert_to_rating_scale(self, scores):
        """Convert 5-class sentiment scores to -5 to 5 scale"""
        # Calculate weighted average of scores
        score_values = np.array([1, 2, 3, 4, 5])
        weighted_score = np.sum(scores * score_values)

        # Convert from 1-5 scale to -5 to 5 scale
        rating = (weighted_score - 3) * (10 / 4)  # Center at 0 and scale
        return max(min(rating, 5), -5)  # Clamp between -5 and 5

    def _get_sentiment_label(self, rating):
        """Convert rating to sentiment label"""
        if rating < -1:
            return "negative"
        elif rating > 1:
            return "positive"
        else:
            return "neutral"


# Create a single instance of SentimentAnalyzer to be reused
analyzer = SentimentAnalyzer()

if __name__ == "__main__":
    # Assume comments are passed as a single string in the first argument
    text = sys.argv[1]
    sentiment = analyzer.analyze_sentiment(text)
    print(json.dumps(sentiment))
